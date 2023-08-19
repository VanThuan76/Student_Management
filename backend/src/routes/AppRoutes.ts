import express from "express";
import { deleteStudent, getListStudentByClass, getStudentById, listStudent, newStudent, updateStudent } from "../controllers/student/StudentController";
import { deleteClass, getClassByDepartmentId, getClassById, listClass, newClass, updateClass } from "../controllers/class/ClassController";
import { deleteDepartment, getDepartmentById, listDepartment, newDepartment, updateDepartment } from "../controllers/department/DepartmentControllers";
import { authenticated, changePassword, deleteAccount, getAccountById, listAccount, newAccount, updateAccount } from "../controllers/account/AccountController";
import { deleteSubject, getListSubjectByClass, getSubjectById, listSubject, newSubject, updateSubject } from "../controllers/subject/SubjectController";
import { deleteAttendance, getAttendanceById, listAttendance, newAttendance, updateAttendance } from "../controllers/attendence/AttendenceController";
import { deleteScore, getScoreById, listScore, newScore, updateScore } from "../controllers/score/ScoreController";
import { dbConnection } from "../db";



const router = express.Router();
//Auth
router.post("/login", authenticated);
//User-account
router.put("/forget-password", changePassword);
router.get("/account", listAccount);
router.get("/account/:user_id", getAccountById);
router.post("/account", newAccount);
router.put("/account/:user_id", updateAccount);
router.delete("/account/:user_id", deleteAccount);
//Department
router.get("/department", listDepartment);
router.get("/department/:department_id", getDepartmentById);
router.post("/department", newDepartment);
router.put("/department/:department_id", updateDepartment);
router.delete("/department/:department_id", deleteDepartment);
//Class
router.get("/class", listClass);
router.get("/class/:class_id", getClassById);
router.get("/classByDepartment/:department_id", getClassByDepartmentId);
router.post("/class", newClass);
router.put("/class/:class_id", updateClass);
router.delete("/class/:class_id", deleteClass);
//Student
router.get("/student", listStudent);
router.get("/student/:student_id", getStudentById);
router.get("/studentByClass/:class_id", getListStudentByClass);
router.post("/student", newStudent);
router.put("/student/:student_id", updateStudent);
router.delete("/student/:student_id", deleteStudent);
// router.get("/student/search?key:", deleteStudent);
//Subject
router.get("/subject", listSubject);
router.get("/subject/:subject_id", getSubjectById);
router.get("/subjectByClass/:class_id", getListSubjectByClass);
router.post("/subject", newSubject);
router.put("/subject/:subject_id", updateSubject);
router.delete("/subject/:subject_id", deleteSubject);
//Score
router.get("/score", listScore);
router.get("/score/:score_id", getScoreById);
router.post("/score", newScore);
router.put("/score/:score_id", updateScore);
router.delete("/score/:score_id", deleteScore);
//Attendence
router.get("/attendence", listAttendance);
router.get("/attendence/:attendance_id", getAttendanceById);
router.post("/attendence", newAttendance);
router.put("/attendence/:attendence_id", updateAttendance);
router.delete("/attendence/:attendence_id", deleteAttendance);






export default router;
