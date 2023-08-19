import { AxiosResponse } from 'axios';
import { https, httpsNoToken } from '../config/https.config';
import { IScore } from '../typeDef/score.type';


class ScoreService {
  getAllScore(): Promise<AxiosResponse<IScore[]>> {
    return httpsNoToken.get('/score')
  }
  getScoreById(id: number): Promise<AxiosResponse<IScore>> {
    return httpsNoToken.get(`/score/${id}`)
  }
  newScore(body: { department_id: number, class_id: number, student_id: number, subject_id: number, score: number }) {
    return httpsNoToken.post("/score", body)
  }
  updateScore(id: number, body: { department_id: number, class_id: number, student_id: number, subject_id: number, score: number }) {
    return httpsNoToken.put(`/score/${id}`, body)
  }
  deleteScore(id: number) {
    return https.delete(`/score/${id}`)
  }
}

export const scoreService = new ScoreService()
