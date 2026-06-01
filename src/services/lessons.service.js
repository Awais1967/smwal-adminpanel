import http from "./http";
import { ENDPOINTS } from "./endpoints";

const lessonsService = {
  async list(params) {
    const { data } = await http.get(ENDPOINTS.lessons, { params });
    return data;
  },
  async listByCourse(courseId, params) {
    const { data } = await http.get(
      `${ENDPOINTS.courses}/${courseId}/lessons`,
      { params },
    );
    return data;
  },
  async create(payload) {
    const { data } = await http.post(ENDPOINTS.lessons, payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await http.put(`${ENDPOINTS.lessons}/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await http.delete(`${ENDPOINTS.lessons}/${id}`);
    return data;
  },
};

export default lessonsService;
