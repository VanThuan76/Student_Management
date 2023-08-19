import { Connection } from "mysql2/promise";
import { Request, Response } from "express";
import { Class } from "../../models/class.model"
import { Department } from "../../models/department.model";


export const listClass = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  try {
    // @ts-ignore
    const [classRows] = await dbConnection.query<Class[]>('SELECT * FROM class');
    const activeClasses = classRows.filter((classItem) => classItem.active === 1);
    const departmentIds = Array.from(new Set(activeClasses.map((classItem) => classItem.department_id)));
    // @ts-ignore
    const [departmentRows] = await dbConnection.query<Department[]>(`SELECT * FROM department WHERE id IN (${departmentIds.join(",")})`);
    const departmentMap: Record<number, Department> = {};
    departmentRows.forEach((department) => {
      departmentMap[department.id] = department;
    });
    const classesWithDepartments = activeClasses.map((classItem) => ({
      ...classItem,
      department: departmentMap[classItem.department_id],
    }));

    res.status(200).json(classesWithDepartments);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Error fetching classes' });
  }
};

export const getClassByDepartmentId = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  const departmentId = req.params.department_id; // Lấy department_id từ URL params

  try {
    // @ts-ignore
    // Lấy thông tin các lớp học từ bảng class dựa trên department_id
    const [classRows] = await dbConnection.query<Class[]>(
      "SELECT * FROM class WHERE department_id = ?",
      [departmentId]
    );

    // Kiểm tra xem có lớp học nào thuộc department_id đã cho hay không
    if (classRows.length === 0) {
      return res.status(404).json({ error: "No classes found for this department" });
    }

    // Trả về thông tin các lớp học thuộc department_id đã cho
    return res.status(200).json(classRows);
  } catch (error) {
    console.error("Error getting classes by department id:", error);
    return res.status(500).json({ error: "Error getting classes by department id" });
  }
};

export const getClassById = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  const classId = req.params.class_id; // Lấy class_id từ URL params

  try {
    // @ts-ignore
    // Lấy thông tin lớp học từ bảng class dựa trên class_id
    const [classRows] = await dbConnection.query<Class[]>(
      "SELECT * FROM class WHERE id = ?",
      [classId]
    );

    // Kiểm tra xem có lớp học nào khớp với class_id hay không
    if (classRows.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }

    const classItem = classRows[0];

    // @ts-ignore
    // Lấy thông tin department tương ứng với department_id của lớp học
    const [departmentRows] = await dbConnection.query<Department[]>(
      "SELECT * FROM department WHERE id = ?",
      [classItem.department_id]
    );

    // Kiểm tra xem có department nào khớp với department_id hay không
    if (departmentRows.length === 0) {
      return res.status(404).json({ error: "Department not found for this class" });
    }

    const department = departmentRows[0];

    // Trả về thông tin lớp học và department tương ứng
    return res.status(200).json({ ...classItem, department });
  } catch (error) {
    console.error("Error getting class:", error);
    return res.status(500).json({ error: "Error getting class" });
  }
};

export const newClass = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  const { department_id, ma_lop_hoc, name } = req.body;

  try {
    // @ts-ignore
    // Kiểm tra xem lớp học đã tồn tại chưa dựa vào department_id và ma_lop_hoc
    const [existingClass] = await dbConnection.query<Class[]>(
      "SELECT * FROM class WHERE department_id = ? AND ma_lop_hoc = ?",
      [department_id, ma_lop_hoc]
    );

    if (existingClass.length > 0) {
      return res.status(400).json({ error: "Class already exists" });
    }

    // Thêm lớp học mới vào database
    await dbConnection.query(
      "INSERT INTO class (department_id, ma_lop_hoc, name) VALUES (?, ?, ?)",
      [department_id, ma_lop_hoc, name]
    );

    return res.status(200).json({ message: "Class registered successfully" });
  } catch (error) {
    console.error("Error registering class:", error);
    return res.status(500).json({ error: "Error registering class" });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  const classId = req.params.class_id;
  const { department_id, ma_lop_hoc, name } = req.body;

  try {
    // @ts-ignore
    // Kiểm tra xem lớp học có tồn tại không dựa vào class_id
    const [existingClass] = await dbConnection.query<Class[]>(
      "SELECT * FROM class WHERE id = ?",
      [classId]
    );

    if (existingClass.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Cập nhật thông tin lớp học trong database
    await dbConnection.query(
      "UPDATE class SET department_id = ?, ma_lop_hoc = ?, name = ? WHERE id = ?",
      [department_id, ma_lop_hoc, name, classId]
    );

    return res.status(200).json({ message: "Class updated successfully" });
  } catch (error) {
    console.error("Error updating class:", error);
    return res.status(500).json({ error: "Error updating class" });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  const classId = req.params.class_id; // Lấy class_id từ URL params

  try {
    // @ts-ignore
    // Kiểm tra xem lớp học có tồn tại không dựa vào class_id
    const [existingClass] = await dbConnection.query<Class[]>(
      "SELECT * FROM class WHERE id = ?",
      [classId]
    );

    if (existingClass.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Xóa lớp học từ bảng class
    await dbConnection.query("DELETE FROM class WHERE id = ?", [classId]);

    return res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    return res.status(500).json({ error: "Error deleting class" });
  }
};



