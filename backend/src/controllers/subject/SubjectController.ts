import { Connection } from "mysql2/promise";
import { Request, Response } from "express";
import { Student } from "../../models/student.model";
import { Subject } from "../../models/subject.model";
import { Class } from "../../models/class.model";
import { Department } from "../../models/department.model";

export const listSubject = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    try {
        // @ts-ignore
        const [subjectRows] = await dbConnection.query<Subject[]>('SELECT * FROM subject');
        const activeSubjects = subjectRows.filter((subjectItem) => subjectItem.active === 1);
        const studentIds = Array.from(new Set(activeSubjects.map((subjectItem) => subjectItem.student_id)));

        // @ts-ignore
        const [studentRows] = await dbConnection.query<Student[]>(`SELECT * FROM student WHERE id IN (${studentIds.join(",")})`);
        const studentMap: Record<number, Student> = {};
        studentRows.forEach((student) => {
            studentMap[student.id] = student;
        });

        const classIds = Array.from(new Set(studentRows.map((studentItem) => studentItem.class_id)));
        // @ts-ignore
        const [classRows] = await dbConnection.query<Class[]>(`SELECT * FROM class WHERE id IN (${classIds.join(",")})`);
        const classMap: Record<number, Class> = {};
        classRows.forEach((classItem) => {
            classMap[classItem.id] = classItem;
        });

        const departmentIds = Array.from(new Set(studentRows.map((studentItem) => studentItem.department_id)));
        // @ts-ignore
        const [departmentRows] = await dbConnection.query<Department[]>(`SELECT * FROM department WHERE id IN (${departmentIds.join(",")})`);
        const departmentMap: Record<number, Department> = {};
        departmentRows.forEach((department) => {
            departmentMap[department.id] = department;
        });

        const subjectsWithStudents = activeSubjects.map((subjectItem) => ({
            ...subjectItem,
            student: studentMap[subjectItem.student_id],
            class: classMap[studentMap[subjectItem.student_id]?.class_id],
            department: departmentMap[studentMap[subjectItem.student_id]?.department_id],
        }));

        res.status(200).json(subjectsWithStudents);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Error fetching subjects' });
    }
};

export const getListSubjectByClass = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const classId = req.params.class_id; // Lấy class_id từ URL params

    try {
        // @ts-ignore
        // Lấy danh sách học sinh từ bảng student dựa trên class_id
        const [studentRows] = await dbConnection.query<Student[]>(
            "SELECT * FROM student WHERE class_id = ?",
            [classId]
        );

        // Kiểm tra xem có học sinh nào trong lớp này hay không
        if (studentRows.length === 0) {
            return res.status(404).json({ error: "No students found in this class" });
        }

        const studentIds = studentRows.map((studentItem) => studentItem.id);

        // @ts-ignore
        // Lấy danh sách môn học từ bảng subject dựa trên student_id của các học sinh trong lớp
        const [subjectRows] = await dbConnection.query<Subject[]>(
            `SELECT * FROM subject WHERE student_id IN (${studentIds.join(",")})`
        );

        // Kiểm tra xem có môn học nào cho các học sinh trong lớp hay không
        if (subjectRows.length === 0) {
            return res.status(404).json({ error: "No subjects found for students in this class" });
        }

        const activeSubjects = subjectRows.filter((subjectItem) => subjectItem.active === 1);

        const studentMap: Record<number, Student> = {};
        studentRows.forEach((student) => {
            studentMap[student.id] = student;
        });

        const classIds = Array.from(new Set(studentRows.map((studentItem) => studentItem.class_id)));
        // @ts-ignore
        const [classRows] = await dbConnection.query<Class[]>(`SELECT * FROM class WHERE id IN (${classIds.join(",")})`);
        const classMap: Record<number, Class> = {};
        classRows.forEach((classItem) => {
            classMap[classItem.id] = classItem;
        });

        const departmentIds = Array.from(new Set(studentRows.map((studentItem) => studentItem.department_id)));
        // @ts-ignore
        const [departmentRows] = await dbConnection.query<Department[]>(`SELECT * FROM department WHERE id IN (${departmentIds.join(",")})`);
        const departmentMap: Record<number, Department> = {};
        departmentRows.forEach((department) => {
            departmentMap[department.id] = department;
        });

        const subjectsWithStudents = activeSubjects.map((subjectItem) => ({
            ...subjectItem,
            student: studentMap[subjectItem.student_id],
            class: classMap[studentMap[subjectItem.student_id]?.class_id],
            department: departmentMap[studentMap[subjectItem.student_id]?.department_id],
        }));

        res.status(200).json(subjectsWithStudents);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Error fetching subjects' });
    }
};

export const getSubjectById = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const subjectId = req.params.subject_id;

    try {
        // @ts-ignore
        const [subjectRows] = await dbConnection.query<Subject[]>(
            "SELECT * FROM subject WHERE id = ?",
            [subjectId]
        );

        if (subjectRows.length === 0) {
            return res.status(404).json({ error: "Subject not found" });
        }

        const subjectItem = subjectRows[0];

        // @ts-ignore
        const [studentRows] = await dbConnection.query<Student[]>(
            "SELECT * FROM student WHERE id = ?",
            [subjectItem.student_id]
        );

        if (studentRows.length === 0) {
            return res.status(404).json({ error: "Student not found for this subject" });
        }


        const student = studentRows[0];
        // @ts-ignore
        const [classRows] = await dbConnection.query<Class[]>(
            "SELECT * FROM class WHERE id = ?",
            [student.class_id]
        );
        // @ts-ignore
        const [departmentRows] = await dbConnection.query<Department[]>(
            "SELECT * FROM department WHERE id = ?",
            [student.department_id]
        );

        const classInfo = classRows[0];
        const departmentInfo = departmentRows[0];

        return res.status(200).json({
            ...subjectItem,
            student,
            class: classInfo,
            department: departmentInfo,
        });
    } catch (error) {
        console.error("Error getting subject:", error);
        return res.status(500).json({ error: "Error getting subject" });
    }
};

export const newSubject = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const { student_id, ma_mon_hoc, name, department_id, class_id } = req.body;

    try {
        // @ts-ignore
        const [existingSubject] = await dbConnection.query<Subject[]>(
            "SELECT * FROM subject WHERE student_id = ? AND ma_mon_hoc = ?",
            [student_id, ma_mon_hoc]
        );

        if (existingSubject.length > 0) {
            return res.status(400).json({ error: "Subject already exists for this student" });
        }

        await dbConnection.query(
            "INSERT INTO subject (student_id, ma_mon_hoc, name, department_id, class_id) VALUES (?, ?, ?, ?, ?)",
            [student_id, ma_mon_hoc, name, department_id, class_id]
        );

        return res.status(200).json({ message: "Subject registered successfully" });
    } catch (error) {
        console.error("Error registering subject:", error);
        return res.status(500).json({ error: "Error registering subject" });
    }
};

export const updateSubject = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const { subject_id, student_id, ma_mon_hoc, name, department_id, class_id } = req.body;

    try {
        // @ts-ignore
        const [existingSubject] = await dbConnection.query<Subject[]>(
            "SELECT * FROM subject WHERE id = ?",
            [subject_id]
        );

        if (existingSubject.length === 0) {
            return res.status(404).json({ error: "Subject not found" });
        }

        await dbConnection.query(
            "UPDATE subject SET student_id = ?, ma_mon_hoc = ?, name = ?, department_id = ?, class_id = ? WHERE id = ?",
            [student_id, ma_mon_hoc, name, department_id, class_id, subject_id]
        );

        return res.status(200).json({ message: "Subject updated successfully" });
    } catch (error) {
        console.error("Error updating subject:", error);
        return res.status(500).json({ error: "Error updating subject" });
    }
};


export const deleteSubject = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const subjectId = req.params.subject_id;

    try {
        // @ts-ignore
        const [existingSubject] = await dbConnection.query<Subject[]>(
            "SELECT * FROM subject WHERE id = ?",
            [subjectId]
        );

        if (existingSubject.length === 0) {
            return res.status(404).json({ error: "Subject not found" });
        }

        await dbConnection.query("DELETE FROM subject WHERE id = ?", [subjectId]);

        return res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        console.error("Error deleting subject:", error);
        return res.status(500).json({ error: "Error deleting subject" });
    }
};
