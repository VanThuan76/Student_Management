import { AxiosResponse } from 'axios';
import { https, httpsNoToken } from '../config/https.config';
import { IStudent } from '../typeDef/student.type';


class StudentService {
  getAllStudent(): Promise<AxiosResponse<IStudent[]>> {
    return httpsNoToken.get('/student')
  }
  getStudentById(id: number): Promise<AxiosResponse<IStudent>> {
    return httpsNoToken.get(`/student/${id}`)
  }
  getStudentByClass(id: number): Promise<AxiosResponse<IStudent[]>> {
    return httpsNoToken.get(`/studentByClass/${id}`)
  }
  newStudent(body: { department_id: number, class_id: number, ma_sinh_vien: string, name: string, birthday: string }) {
    return httpsNoToken.post("/student", body)
  }
  updateStudent(id: number, body: { department_id: number, class_id: number, ma_sinh_vien: string, name: string, birthday: string }) {
    return httpsNoToken.put(`/student/${id}`, body)
  }
  deleteStudent(id: number) {
    return https.delete(`/student/${id}`)
  }
}

export const studentService = new StudentService()
