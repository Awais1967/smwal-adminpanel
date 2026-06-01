import http from "./http";
import { ENDPOINTS } from "./endpoints";
import { flattenTableParams, normalizeListResponse } from "./apiUtils";

const mentorshipService = {
  async list(params) {
    const { data } = await http.get(ENDPOINTS.mentorship, {
      params: flattenTableParams(params),
    });
    return normalizeListResponse(data);
  },
  async getById(id) {
    const { data } = await http.get(`${ENDPOINTS.mentorship}/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await http.post(ENDPOINTS.mentorship, payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await http.put(`${ENDPOINTS.mentorship}/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await http.delete(`${ENDPOINTS.mentorship}/${id}`);
    return data;
  },
};

export default mentorshipService;
