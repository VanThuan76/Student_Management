import { Connection } from "mysql2/promise";
import { Request, Response } from "express";
import { Account } from "../../models/account.model";

export const authenticated = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  const { username, password } = req.body;

  try {
    // @ts-ignore
    const [rows] = await dbConnection.query<Account[]>(
      "SELECT * FROM user WHERE username = ? AND password = ? AND active = 1",
      [username, password]
    );

    if (rows.length === 1) {
      res.status(200).json({ message: "Login successful", account: rows[0] });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  const { username, oldPassword, newPassword } = req.body;

  try {
      // @ts-ignore
      const [userRows] = await dbConnection.query<User[]>(
          "SELECT * FROM user WHERE username = ?",
          [username]
      );

      // Kiểm tra xem user có tồn tại hay không
      if (userRows.length === 0) {
          return res.status(404).json({ error: "User not found" });
      }

      const user = userRows[0];

      // Kiểm tra xem mật khẩu cũ đã nhập đúng hay không
      const isPasswordMatch = oldPassword === user.password;

      if (!isPasswordMatch) {
          return res.status(400).json({ error: "Incorrect old password" });
      }

      // Hash mật khẩu mới trước khi lưu vào database
      const hashedNewPassword = newPassword

      // Cập nhật mật khẩu mới vào database
      await dbConnection.query(
          "UPDATE user SET password = ? WHERE id = ?",
          [hashedNewPassword, user.id]
      );

      return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ error: "Error changing password" });
  }
};

export const listAccount = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  try {
      const [rows] = await dbConnection.query('SELECT * FROM user');
      res.status(200).json(rows);
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Error fetching user' });
  }
};

export const getAccountById = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  const userId = req.params.user_id; // Lấy user_id từ URL params

  try {
    // @ts-ignore
    // Lấy thông tin tài khoản từ bảng user dựa trên user_id
    const [rows] = await dbConnection.query<Account[]>(
      "SELECT * FROM user WHERE id = ?",
      [userId]
    );

    // Kiểm tra xem có tài khoản nào khớp với user_id hay không
    if (rows.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Trả về thông tin tài khoản nếu tìm thấy
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error getting account:", error);
    return res.status(500).json({ error: "Error getting account" });
  }
};

export const newAccount = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  const { username, password } = req.body;

  try {
    // @ts-ignore
    // Kiểm tra xem username đã tồn tại trong database chưa
    const [existingUser] = await dbConnection.query<Account[]>(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Thêm tài khoản mới vào database
    await dbConnection.query(
      "INSERT INTO user (username, password) VALUES (?, ?)",
      [username, password]
    );

    return res.status(200).json({ message: "Account registered successfully" });
  } catch (error) {
    console.error("Error registering account:", error);
    return res.status(500).json({ error: "Error registering account" });
  }
};

export const updateAccount = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  const accountId = req.params.user_id; // Lấy id từ URL params
  const { username, password } = req.body;

  try {
    // @ts-ignore
    // Kiểm tra xem tài khoản có tồn tại trong database không dựa vào accountId
    const [existingUser] = await dbConnection.query<Account[]>(
      "SELECT * FROM user WHERE id = ?",
      [accountId]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Cập nhật thông tin tài khoản vào database
    await dbConnection.query(
      "UPDATE user SET username = ?, password = ? WHERE id = ?",
      [username, password, accountId]
    );

    return res.status(200).json({ message: "Account updated successfully" });
  } catch (error) {
    console.error("Error updating account:", error);
    return res.status(500).json({ error: "Error updating account" });
  }
};


export const deleteAccount = async (req: Request, res: Response) => {
  const dbConnection: Connection = req.app.get("dbConnection");
  const userId = req.params.user_id;

  try {
    // @ts-ignore
    const [result] = await dbConnection.query<Account[]>(
      "DELETE FROM user WHERE id = ?",
      [userId]
    );

    if (result.length <=0 ) {
      return res.status(404).json({ error: "Account not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Error deleting account" });
  }
};


