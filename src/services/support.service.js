import http from "./http";
import { ENDPOINTS } from "./endpoints";

const supportService = {
  async list(params) {
    const { data } = await http.get(ENDPOINTS.support, { params });
    return data;
  },
  async getById(id) {
    const { data } = await http.get(`${ENDPOINTS.support}/${id}`);
    return data;
  },
  async reply(id, payload) {
    const { data } = await http.post(
      `${ENDPOINTS.support}/${id}/reply`,
      payload,
    );
    return data;
  },
  async update(id, payload) {
    const { data } = await http.put(`${ENDPOINTS.support}/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await http.delete(`${ENDPOINTS.support}/${id}`);
    return data;
  },
};

export default supportService;
