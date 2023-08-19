import { IDepartment } from "./department.type";

export interface IClass {
  id: number;
  department_id: number;
  ma_lop_hoc: string;
  name: string;
  active: number;
  department: IDepartment;
}

