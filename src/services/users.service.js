import http from "./http";
import { ENDPOINTS } from "./endpoints";
import { flattenTableParams, normalizeListResponse } from "./apiUtils";

const usersService = {
  async list(params) {
    const { data } = await http.get(ENDPOINTS.users, {
      params: flattenTableParams(params),
    });
    return normalizeListResponse(data);
  },
  async getById(id) {
    const { data } = await http.get(`${ENDPOINTS.users}/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await http.post(ENDPOINTS.users, payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await http.put(`${ENDPOINTS.users}/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await http.delete(`${ENDPOINTS.users}/${id}`);
    return data;
  },
};

export default usersService;
