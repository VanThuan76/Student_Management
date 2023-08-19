import { Connection } from "mysql2/promise";
import { Request, Response } from "express";
import { Department } from "../../models/department.model";

export const listDepartment = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    try {
        const [rows] = await dbConnection.query('SELECT * FROM department');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Error fetching departments' });
    }
};
export const getDepartmentById = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const departmentId = req.params.department_id; 

    try {
        // @ts-ignore
        const [rows] = await dbConnection.query<Department[]>(
            "SELECT * FROM department WHERE id = ?",
            [departmentId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Department not found" });
        }
        return res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error getting Department:", error);
        return res.status(500).json({ error: "Error getting Department" });
    }
};
export const newDepartment = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const { ma_khoa, name } = req.body;

    try {
        // @ts-ignore
        const [existingDepartment] = await dbConnection.query<Department[]>(
            "SELECT * FROM department WHERE ma_khoa = ?",
            [ma_khoa]
        );

        if (existingDepartment.length > 0) {
            return res.status(400).json({ error: "Department already exists" });
        }

        await dbConnection.query(
            "INSERT INTO department (ma_khoa, name) VALUES (?, ?)",
            [ma_khoa, name]
        );

        return res.status(200).json({ message: "Department registered successfully" });
    } catch (error) {
        console.error("Error registering Department:", error);
        return res.status(500).json({ error: "Error registering Department" });
    }
};

export const updateDepartment = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const departmentId = req.params.department_id; 
    const { ma_khoa, name } = req.body;

    try {
        // @ts-ignore
        // Kiểm tra xem bộ phận có tồn tại trong database không
        const [existingDepartment] = await dbConnection.query<Department[]>(
            "SELECT * FROM department WHERE id = ?",
            [departmentId]
        );

        if (existingDepartment.length === 0) {
            return res.status(404).json({ error: "Department not found" });
        }

        // Cập nhật thông tin bộ phận
        await dbConnection.query(
            "UPDATE department SET ma_khoa = ?, name = ? WHERE id = ?",
            [ma_khoa, name, departmentId]
        );

        return res.status(200).json({ message: "Department updated successfully" });
    } catch (error) {
        console.error("Error updating Department:", error);
        return res.status(500).json({ error: "Error updating Department" });
    }
};

export const deleteDepartment = async (req: Request, res: Response) => {
    const dbConnection: Connection = req.app.get("dbConnection");
    const departmentId = req.params.department_id;

    try {
        // @ts-ignore
        const [result] = await dbConnection.query<Department[]>(
            "DELETE FROM department WHERE id = ?",
            [departmentId]
        );

        if (result.length <= 0) {
            return res.status(404).json({ error: "Department not found" });
        }

        res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
        console.error("Error deleting Department:", error);
        res.status(500).json({ error: "Error deleting Department" });
    }
};



