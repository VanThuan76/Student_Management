import { IClass } from "./class.type";
import { IDepartment } from "./department.type";
import { IStudent } from "./student.type";
import { ISubject } from "./subject.type";

export interface IAttendence {
  id: number;
  department_id?: any;
  class_id?: any;
  student_id: number;
  subject_id: number;
  number: string;
  active: number;
  student: IStudent;
  subject: ISubject;
  class: IClass;
  department: IDepartment;
}