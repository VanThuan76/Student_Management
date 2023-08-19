import { IClass } from "./class.type";
import { IDepartment } from "./department.type";
import { IStudent } from "./student.type";
import { ISubject } from "./subject.type";

export interface IScore {
  id: number;
  department_id: number;
  class_id: number;
  student_id: number;
  subject_id: number;
  score: number;
  active: number;
  student: IStudent;
  subject: ISubject;
  class: IClass;
  department: IDepartment;
}