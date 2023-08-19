import { Connection } from "mysql2/promise";
import { Request, Response } from "express";
import { Class } from "../../models/class.model";
import { Department } from "../../models/department.model";
import { Student } from "../../models/student.model";

export const listStudent = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    try {
        // @ts-ignore
        const [studentRows] = await dbConnection.query<Student[]>('SELECT * FROM student');
        const activeStudents = studentRows.filter((studentItem: Student) => (studentItem as Student).active === 1) as Student[];
        const departmentIds = Array.from(new Set(activeStudents.map((studentItem) => studentItem.department_id)));
        // @ts-ignore
        const [departmentRows] = await dbConnection.query<Department[]>(`SELECT * FROM department WHERE id IN (${departmentIds.join(",")})`);
        const departmentMap: Record<number, Department> = {};
        departmentRows.forEach((department) => {
            departmentMap[department.id] = department as Department;
        });
        const classIds = Array.from(new Set(activeStudents.map((studentItem) => studentItem.class_id)));
        // @ts-ignore
        const [classRows] = await dbConnection.query<Class[]>(`SELECT * FROM class WHERE id IN (${classIds.join(",")})`);
        const classMap: Record<number, Class> = {};
        classRows.forEach((classItem) => {
            classMap[classItem.id] = classItem as Class;
        });
        const studentsWithInfo = activeStudents.map((studentItem) => ({
            ...studentItem,
            department: departmentMap[studentItem.department_id],
            class: classMap[studentItem.class_id],
        }));
        res.status(200).json(studentsWithInfo);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Error fetching students' });
    }
};

export const getListStudentByClass = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const classId = req.params.class_id; // Lấy class_id từ URL params

    try {
        // @ts-ignore
        // Lấy danh sách sinh viên từ bảng student dựa trên class_id
        const [studentRows] = await dbConnection.query<Student[]>(
            "SELECT * FROM student WHERE class_id = ?",
            [classId]
        );

        // Kiểm tra xem có sinh viên nào trong lớp học này hay không
        if (studentRows.length === 0) {
            return res.status(404).json({ error: "No students found for this class" });
        }

        res.status(200).json(studentRows);
    } catch (error) {
        console.error("Error fetching students by class:", error);
        res.status(500).json({ error: "Error fetching students by class" });
    }
};

export const getStudentById = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const studentId = req.params.student_id; // Lấy student_id từ URL params

    try {
        // @ts-ignore
        // Lấy thông tin sinh viên từ bảng student dựa trên student_id
        const [student] = await dbConnection.query<Student[]>(
            "SELECT * FROM student WHERE id = ?",
            [studentId]
        );

        // Kiểm tra xem có sinh viên nào khớp với student_id hay không
        if (student.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        // @ts-ignore
        // Lấy thông tin phòng ban từ bảng department dựa vào department_id của sinh viên
        const [department] = await dbConnection.query<Department[]>(
            "SELECT * FROM department WHERE id = ?",
            [student[0].department_id]
        );

        // @ts-ignore
        // Lấy thông tin lớp học từ bảng class dựa vào class_id của sinh viên
        const [classInfo] = await dbConnection.query<Class[]>(
            "SELECT * FROM class WHERE id = ?",
            [student[0].class_id]
        );

        // Trả về thông tin sinh viên cùng với thông tin phòng ban và lớp học
        return res.status(200).json({
            ...student[0],
            department: department[0],
            class: classInfo[0],
        });
    } catch (error) {
        console.error("Error getting student:", error);
        return res.status(500).json({ error: "Error getting student" });
    }
};


export const newStudent = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const { department_id, class_id, ma_sinh_vien, name, birthday } = req.body;

    try {
        // @ts-ignore
        // Kiểm tra xem học sinh đã tồn tại chưa dựa vào class_id và ma_sinh_vien
        const [existingStudent] = await dbConnection.query<Student[]>(
            "SELECT * FROM student WHERE class_id = ? AND ma_sinh_vien = ?",
            [class_id, ma_sinh_vien]
        );

        if (existingStudent.length > 0) {
            return res.status(400).json({ error: "Student already exists in this class" });
        }

        // Thêm sinh viên mới vào bảng student
        await dbConnection.query(
            "INSERT INTO student (department_id, class_id, ma_sinh_vien, name, birthday) VALUES (?, ?, ?, ?, ?)",
            [department_id, class_id, ma_sinh_vien, name, birthday]
        );

        return res.status(200).json({ message: "Student registered successfully" });
    } catch (error) {
        console.error("Error registering student:", error);
        return res.status(500).json({ error: "Error registering student" });
    }
};

export const updateStudent = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const studentId = req.params.student_id; // Lấy student_id từ URL params
    const { department_id, class_id, ma_sinh_vien, name, birthday } = req.body;

    try {
        // @ts-ignore
        // Kiểm tra xem sinh viên tồn tại trong bảng student dựa trên student_id
        const [existingStudent] = await dbConnection.query<Student[]>(
            "SELECT * FROM student WHERE id = ?",
            [studentId]
        );

        if (existingStudent.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Cập nhật thông tin sinh viên trong bảng student
        await dbConnection.query(
            "UPDATE student SET department_id = ?, class_id = ?, ma_sinh_vien = ?, name = ?, birthday = ? WHERE id = ?",
            [department_id, class_id, ma_sinh_vien, name, birthday, studentId]
        );

        return res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
        console.error("Error updating student:", error);
        return res.status(500).json({ error: "Error updating student" });
    }
};

export const deleteStudent = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const studentId = req.params.id; // Lấy student_id từ URL params

    try {
        // @ts-ignore
        const [existingStudent] = await dbConnection.query<Student[]>(
            "SELECT * FROM student WHERE id = ?",
            [studentId]
        );

        if (existingStudent.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        return res.status(500).json({ error: "Error deleting student" });
    }
};

export const searchStudents = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const key = req.query.key;

    if (!key) {
        return res.status(400).json({ error: "Missing 'key' parameter" });
    }

    try {
        // Get the column names of the student table
        // We assume that the model properties match the column names in the table
        const columnNames = Object.keys(new Student());

        let query = "SELECT * FROM student WHERE";
        const params: any[] = [];

        for (let i = 0; i < columnNames.length; i++) {
            const columnName = columnNames[i];

            // Construct the query to search for the key value across all fields
            query += ` ${columnName} LIKE ? OR`;
            params.push(`%${key}%`);
        }

        // Remove the trailing 'OR' and add a semicolon to complete the query
        query = query.slice(0, -3) + ";";

        // @ts-ignore
        const [studentRows] = await dbConnection.query<Student[]>(query, params);

        res.status(200).json(studentRows);
    } catch (error) {
        console.error("Error searching students:", error);
        res.status(500).json({ error: "Error searching students" });
    }
};









