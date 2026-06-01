import http from "./http";
import { ENDPOINTS } from "./endpoints";

const matchesService = {
  async list(params) {
    const { data } = await http.get(ENDPOINTS.matches, { params });
    return data; // { items, total }
  },
  async getById(id) {
    const { data } = await http.get(`${ENDPOINTS.matches}/${id}`);
    return data;
  },
  async update(id, payload) {
    const { data } = await http.put(`${ENDPOINTS.matches}/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await http.delete(`${ENDPOINTS.matches}/${id}`);
    return data;
  },
};

export default matchesService;
