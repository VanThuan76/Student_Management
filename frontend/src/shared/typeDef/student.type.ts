import { IClass } from "./class.type";
import { IDepartment } from "./department.type";

export interface IStudent {
  id: number;
  department_id: number;
  class_id: number;
  ma_sinh_vien: string;
  name: string;
  birthday: string;
  active: number;
  department: IDepartment;
  class: IClass;
}
