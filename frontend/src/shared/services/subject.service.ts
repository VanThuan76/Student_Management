import { AxiosResponse } from 'axios';
import { https, httpsNoToken } from '../config/https.config';
import { ISubject } from '../typeDef/subject.type';


class SubjectService {
  getAllSubject(): Promise<AxiosResponse<ISubject[]>> {
    return httpsNoToken.get('/subject')
  }
  getSubjectById(id: number): Promise<AxiosResponse<ISubject>> {
    return httpsNoToken.get(`/subject/${id}`)
  }
  getSubjectByClass(id: number): Promise<AxiosResponse<ISubject[]>> {
    return httpsNoToken.get(`/subjectByClass/${id}`)
  }
  newSubject(body: { department_id: number, class_id: number, student_id: number, ma_mon_hoc: string, name: string }) {
    return httpsNoToken.post("/subject", body)
  }
  updateSubject(id: number, body: { department_id: number, class_id: number, student_id: number, ma_mon_hoc: string, name: string }) {
    return httpsNoToken.put(`/subject/${id}`, body)
  }
  deleteSubject(id: number) {
    return https.delete(`/subject/${id}`)
  }
}

export const subjectService = new SubjectService()
