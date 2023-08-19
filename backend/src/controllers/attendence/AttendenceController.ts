import { Connection } from "mysql2/promise";
import { Request, Response } from "express";
import { Student } from "../../models/student.model";
import { Subject } from "../../models/subject.model";
import { Attendance } from "../../models/attendace.model";
import { Class } from "../../models/class.model";
import { Department } from "../../models/department.model";

export const listAttendance = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    try {
        // @ts-ignore
        const [attendanceRows] = await dbConnection.query<Attendance[]>('SELECT * FROM attendance');

        if (attendanceRows.length === 0) {
            return res.status(200).json([]);
        }

        const studentIds = Array.from(new Set(attendanceRows.map((attendanceItem) => attendanceItem.student_id)));
        const subjectIds = Array.from(new Set(attendanceRows.map((attendanceItem) => attendanceItem.subject_id)));

        // @ts-ignore
        const [studentRows] = await dbConnection.query<Student[]>(`SELECT * FROM student WHERE id IN (${studentIds.join(",")})`);
        const studentMap: Record<number, Student> = {};
        studentRows.forEach((student) => {
            studentMap[student.id] = student;
        });

        // @ts-ignore
        const [subjectRows] = await dbConnection.query<Subject[]>(`SELECT * FROM subject WHERE id IN (${subjectIds.join(",")})`);
        const subjectMap: Record<number, Subject> = {};
        subjectRows.forEach((subject) => {
            subjectMap[subject.id] = subject;
        });

        const classIds = Array.from(new Set(attendanceRows.map((attendanceItem) => studentMap[attendanceItem.student_id]?.class_id)));
        // @ts-ignore
        const [classRows] = await dbConnection.query<Class[]>(`SELECT * FROM class WHERE id IN (${classIds.join(",")})`);
        const classMap: Record<number, Class> = {};
        classRows.forEach((classItem) => {
            classMap[classItem.id] = classItem;
        });

        const departmentIds = Array.from(new Set(attendanceRows.map((attendanceItem) => studentMap[attendanceItem.student_id]?.department_id)));
        // @ts-ignore
        const [departmentRows] = await dbConnection.query<Department[]>(`SELECT * FROM department WHERE id IN (${departmentIds.join(",")})`);
        const departmentMap: Record<number, Department> = {};
        departmentRows.forEach((department) => {
            departmentMap[department.id] = department;
        });

        const attendanceWithInfo = attendanceRows.map((attendanceItem) => ({
            ...attendanceItem,
            student: studentMap[attendanceItem.student_id],
            subject: subjectMap[attendanceItem.subject_id],
            class: classMap[studentMap[attendanceItem.student_id]?.class_id],
            department: departmentMap[studentMap[attendanceItem.student_id]?.department_id],
        }));

        res.status(200).json(attendanceWithInfo);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ error: 'Error fetching attendance' });
    }
};


export const getAttendanceById = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const attendanceId = req.params.attendance_id; // Get attendance_id from URL params

    try {
        // @ts-ignore
        // Fetch the attendance record from the attendance table based on attendance_id
        const [attendanceRows] = await dbConnection.query<Attendance[]>(
            "SELECT * FROM attendance WHERE id = ?",
            [attendanceId]
        );

        // Check if there is any attendance record matching the attendance_id
        if (attendanceRows.length === 0) {
            return res.status(404).json({ error: "Attendance not found" });
        }

        const attendanceItem = attendanceRows[0];

        // @ts-ignore
        // Fetch student and subject information corresponding to student_id and subject_id
        const [studentRows] = await dbConnection.query<Student[]>(
            "SELECT * FROM student WHERE id = ?",
            [attendanceItem.student_id]
        );

        // @ts-ignore
        const [subjectRows] = await dbConnection.query<Subject[]>(
            "SELECT * FROM subject WHERE id = ?",
            [attendanceItem.subject_id]
        );

        // Check if the student and subject information exists
        if (studentRows.length === 0 || subjectRows.length === 0) {
            return res.status(404).json({ error: "Student or Subject not found for this attendance" });
        }

        const student = studentRows[0];
        const subject = subjectRows[0];

        // @ts-ignore
        // Fetch class and department information based on class_id and department_id respectively
        const [classInfo] = await dbConnection.query<Class[]>(
            "SELECT * FROM class WHERE id = ?",
            [student.class_id]
        );
        // @ts-ignore
        const [departmentInfo] = await dbConnection.query<Department[]>(
            "SELECT * FROM department WHERE id = ?",
            [student.department_id]
        );

        // Return the attendance record along with student, subject, class, and department information
        return res.status(200).json({
            ...attendanceItem,
            student,
            subject,
            class: classInfo[0],
            department: departmentInfo[0],
        });
    } catch (error) {
        console.error("Error getting attendance:", error);
        return res.status(500).json({ error: "Error getting attendance" });
    }
};

export const newAttendance = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const { student_id, subject_id, number, active } = req.body;

    try {
        // @ts-ignore
        // Check if attendance with the same student_id and subject_id already exists
        const [existingAttendance] = await dbConnection.query<Attendance[]>(
            "SELECT * FROM attendance WHERE student_id = ? AND subject_id = ?",
            [student_id, subject_id]
        );

        if (existingAttendance.length > 0) {
            return res.status(400).json({ error: "Attendance already exists for this student and subject" });
        }

        // Add new attendance record to the attendance table
        await dbConnection.query(
            "INSERT INTO attendance (student_id, subject_id, number) VALUES (?, ?, ?)",
            [student_id, subject_id, number]
        );

        return res.status(200).json({ message: "Attendance registered successfully" });
    } catch (error) {
        console.error("Error registering attendance:", error);
        return res.status(500).json({ error: "Error registering attendance" });
    }
};

export const updateAttendance = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const { attendance_id, student_id, subject_id, number, active } = req.body;

    try {
        // @ts-ignore
        // Check if the attendance record exists based on attendance_id
        const [existingAttendance] = await dbConnection.query<Attendance[]>(
            "SELECT * FROM attendance WHERE id = ?",
            [attendance_id]
        );

        if (existingAttendance.length === 0) {
            return res.status(404).json({ error: "Attendance not found" });
        }

        // Update the attendance record in the attendance table
        await dbConnection.query(
            "UPDATE attendance SET student_id = ?, subject_id = ?, number = ?, active = ? WHERE id = ?",
            [student_id, subject_id, number, active, attendance_id]
        );

        return res.status(200).json({ message: "Attendance updated successfully" });
    } catch (error) {
        console.error("Error updating attendance:", error);
        return res.status(500).json({ error: "Error updating attendance" });
    }
};

export const deleteAttendance = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const attendanceId = req.params.attendance_id; // Get attendance_id from URL params

    try {
        // @ts-ignore
        // Check if the attendance record exists based on attendance_id
        const [existingAttendance] = await dbConnection.query<Attendance[]>(
            "SELECT * FROM attendance WHERE id = ?",
            [attendanceId]
        );

        if (existingAttendance.length === 0) {
            return res.status(404).json({ error: "Attendance not found" });
        }

        // Delete the attendance record from the attendance table
        await dbConnection.query("DELETE FROM attendance WHERE id = ?", [attendanceId]);

        return res.status(200).json({ message: "Attendance deleted successfully" });
    } catch (error) {
        console.error("Error deleting attendance:", error);
        return res.status(500).json({ error: "Error deleting attendance" });
    }
};

