import { AxiosResponse } from 'axios';
import { https, httpsNoToken } from '../config/https.config';
import { IDepartment } from '../typeDef/department.type';
import { IResponse } from '../typeDef/response.typ';


class DepartmentService {
  getAllDepartment(): Promise<AxiosResponse<IDepartment[]>> {
    return httpsNoToken.get('/department')
  }
  getDepartmentById(id: number): Promise<AxiosResponse<IDepartment>> {
    return httpsNoToken.get(`/department/${id}`)
  }
  newDepartment(body: { ma_khoa: string, name: string }) {
    return httpsNoToken.post("/department", body)
  }
  updateDepartment(id: number, body: { ma_khoa: string, name: string }) {
    return httpsNoToken.put(`/department/${id}`, body)
  }
  deletedepartment(id: number) {
    return https.delete(`/department/${id}`)
  }
}

export const departmentService = new DepartmentService()
