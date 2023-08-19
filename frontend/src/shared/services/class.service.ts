import { AxiosResponse } from 'axios';
import { https, httpsNoToken } from '../config/https.config';
import { IClass } from '../typeDef/class.type';


class ClassService {
  getAllClass(): Promise<AxiosResponse<IClass[]>> {
    return httpsNoToken.get('/class')
  }
  getClassById(id: number): Promise<AxiosResponse<IClass>> {
    return httpsNoToken.get(`/class/${id}`)
  }
  getClassByDepartment(id: number): Promise<AxiosResponse<IClass[]>> {
    return httpsNoToken.get(`/classByDepartment/${id}`)
  }
  newClass(body: { department_id: number, ma_lop_hoc: string, name: string }) {
    return httpsNoToken.post("/class", body)
  }
  updateClass(id: number, body: { department_id: number, ma_lop_hoc: string, name: string }) {
    return httpsNoToken.put(`/class/${id}`, body)
  }
  deleteClass(id: number) {
    return https.delete(`/class/${id}`)
  }
}

export const classService = new ClassService()
