import { Connection } from "mysql2/promise";
import { Request, Response } from "express";
import { Department } from "../../models/department.model";
import { Class } from "../../models/class.model";
import { Student } from "../../models/student.model";
import { Subject } from "../../models/subject.model";
import { Score } from "../../models/score.model";

export const listScore = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    try {
        // @ts-ignore
        const [scoreRows] = await dbConnection.query<Score[]>('SELECT * FROM score');
        const studentIds = Array.from(new Set(scoreRows.map((scoreItem) => scoreItem.student_id)));
        const subjectIds = Array.from(new Set(scoreRows.map((scoreItem) => scoreItem.subject_id)));
        const classIds = Array.from(new Set(scoreRows.map((scoreItem) => scoreItem.class_id)));
        const departmentIds = Array.from(new Set(scoreRows.map((scoreItem) => scoreItem.department_id)));

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

        // @ts-ignore
        const [classRows] = await dbConnection.query<Class[]>(`SELECT * FROM class WHERE id IN (${classIds.join(",")})`);
        const classMap: Record<number, Class> = {};
        classRows.forEach((classItem) => {
            classMap[classItem.id] = classItem;
        });

        // @ts-ignore
        const [departmentRows] = await dbConnection.query<Department[]>(`SELECT * FROM department WHERE id IN (${departmentIds.join(",")})`);
        const departmentMap: Record<number, Department> = {};
        departmentRows.forEach((department) => {
            departmentMap[department.id] = department;
        });

        const scoresWithInfo = scoreRows.map((scoreItem) => ({
            ...scoreItem,
            student: studentMap[scoreItem.student_id],
            subject: subjectMap[scoreItem.subject_id],
            class: classMap[scoreItem.class_id],
            department: departmentMap[scoreItem.department_id],
        }));

        res.status(200).json(scoresWithInfo);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({ error: 'Error fetching scores' });
    }
};

export const getScoreById = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const scoreId = req.params.score_id;

    try {
        // @ts-ignore
        const [scoreRows] = await dbConnection.query<Score[]>(
            "SELECT * FROM score WHERE id = ?",
            [scoreId]
        );

        if (scoreRows.length === 0) {
            return res.status(404).json({ error: "Score not found" });
        }

        const scoreItem = scoreRows[0];

        // @ts-ignore
        const [studentRows] = await dbConnection.query<Student[]>(
            "SELECT * FROM student WHERE id = ?",
            [scoreItem.student_id]
        );

        if (studentRows.length === 0) {
            return res.status(404).json({ error: "Student not found for this score" });
        }

        const student = studentRows[0];

        // @ts-ignore
        const [subjectRows] = await dbConnection.query<Subject[]>(
            "SELECT * FROM subject WHERE id = ?",
            [scoreItem.subject_id]
        );

        if (subjectRows.length === 0) {
            return res.status(404).json({ error: "Subject not found for this score" });
        }

        const subject = subjectRows[0];

        // @ts-ignore
        const [classRows] = await dbConnection.query<Class[]>(
            "SELECT * FROM class WHERE id = ?",
            [scoreItem.class_id]
        );

        if (classRows.length === 0) {
            return res.status(404).json({ error: "Class not found for this score" });
        }

        const classItem = classRows[0];

        // @ts-ignore
        const [departmentRows] = await dbConnection.query<Department[]>(
            "SELECT * FROM department WHERE id = ?",
            [scoreItem.department_id]
        );

        if (departmentRows.length === 0) {
            return res.status(404).json({ error: "Department not found for this score" });
        }

        const department = departmentRows[0];

        return res.status(200).json({ ...scoreItem, student, subject, class: classItem, department });
    } catch (error) {
        console.error("Error getting score:", error);
        return res.status(500).json({ error: "Error getting score" });
    }
};

export const newScore = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const { department_id, class_id, student_id, subject_id, score } = req.body;

    try {
        // @ts-ignore
        const [existingScore] = await dbConnection.query<Score[]>(
            "SELECT * FROM score WHERE department_id = ? AND class_id = ? AND student_id = ? AND subject_id = ?",
            [department_id, class_id, student_id, subject_id]
        );

        if (existingScore.length > 0) {
            return res.status(400).json({ error: "Score already exists for this student and subject" });
        }

        await dbConnection.query(
            "INSERT INTO score (department_id, class_id, student_id, subject_id, score) VALUES (?, ?, ?, ?, ?)",
            [department_id, class_id, student_id, subject_id, score]
        );

        return res.status(200).json({ message: "Score registered successfully" });
    } catch (error) {
        console.error("Error registering score:", error);
        return res.status(500).json({ error: "Error registering score" });
    }
};

export const updateScore = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const { score_id, department_id, class_id, student_id, subject_id, score } = req.body;

    try {
        // @ts-ignore
        const [existingScore] = await dbConnection.query<Score[]>(
            "SELECT * FROM score WHERE id = ?",
            [score_id]
        );

        if (existingScore.length === 0) {
            return res.status(404).json({ error: "Score not found" });
        }

        await dbConnection.query(
            "UPDATE score SET department_id = ?, class_id = ?, student_id = ?, subject_id = ?, score = ? WHERE id = ?",
            [department_id, class_id, student_id, subject_id, score, score_id]
        );

        return res.status(200).json({ message: "Score updated successfully" });
    } catch (error) {
        console.error("Error updating score:", error);
        return res.status(500).json({ error: "Error updating score" });
    }
};

export const deleteScore = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const scoreId = req.params.score_id;

    try {
        // @ts-ignore
        const [existingScore] = await dbConnection.query<Score[]>(
            "SELECT * FROM score WHERE id = ?",
            [scoreId]
        );

        if (existingScore.length === 0) {
            return res.status(404).json({ error: "Score not found" });
        }

        await dbConnection.query("DELETE FROM score WHERE id = ?", [scoreId]);

        return res.status(200).json({ message: "Score deleted successfully" });
    } catch (error) {
        console.error("Error deleting score:", error);
        return res.status(500).json({ error: "Error deleting score" });
    }
};
