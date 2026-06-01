import http from "./http";
import { ENDPOINTS } from "./endpoints";

const eventsService = {
  async list(params) {
    const { data } = await http.get(ENDPOINTS.events, { params });
    return data;
  },
  async getById(id) {
    const { data } = await http.get(`${ENDPOINTS.events}/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await http.post(ENDPOINTS.events, payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await http.put(`${ENDPOINTS.events}/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await http.delete(`${ENDPOINTS.events}/${id}`);
    return data;
  },
};

export default eventsService;
