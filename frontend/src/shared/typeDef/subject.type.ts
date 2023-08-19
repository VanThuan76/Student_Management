import { IClass } from "./class.type";
import { IDepartment } from "./department.type";
import { IStudent } from "./student.type";

export interface ISubject {
  id: number;
  department_id?: number;
  class_id?: string;
  student_id: number;
  ma_mon_hoc: string;
  name: string;
  active: number;
  student: IStudent;
  class: IClass;
  department: IDepartment;
}
