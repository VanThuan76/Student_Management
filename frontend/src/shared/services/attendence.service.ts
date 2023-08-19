import { AxiosResponse } from 'axios';
import { https, httpsNoToken } from '../config/https.config';
import { IAttendence } from '../typeDef/attendence.type';


class AttendenceService {
  getAllAttendence(): Promise<AxiosResponse<IAttendence[]>> {
    return httpsNoToken.get('/attendence')
  }
  getAttendenceById(id: number): Promise<AxiosResponse<IAttendence>> {
    return httpsNoToken.get(`/attendence/${id}`)
  }
  newAttendence(body: { department_id: number, class_id: number, student_id: number, subject_id: number, number: string }) {
    return httpsNoToken.post("/attendence", body)
  }
  updateAttendence(id: number, body: { department_id: number, class_id: number, student_id: number, subject_id: number, number: string }) {
    return httpsNoToken.put(`/attendence/${id}`, body)
  }
  deleteAttendence(id: number) {
    return https.delete(`/attendence/${id}`)
  }
}

export const attendenceService = new AttendenceService()
