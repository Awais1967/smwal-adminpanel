import http from "./http";
import { ENDPOINTS } from "./endpoints";
import { flattenTableParams, normalizeListResponse } from "./apiUtils";

const coursesService = {
  async list(params) {
    const { data } = await http.get(ENDPOINTS.courses, {
      params: flattenTableParams(params),
    });
    return normalizeListResponse(data);
  },
  async getById(id) {
    const { data } = await http.get(`${ENDPOINTS.courses}/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await http.post(ENDPOINTS.courses, payload);
    return data;
  },
  async upload(file) {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await http.post(`${ENDPOINTS.courses}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
  async update(id, payload) {
    const { data } = await http.put(`${ENDPOINTS.courses}/${id}`, payload);
    return data;
  },
  async remove(id) {
    const { data } = await http.delete(`${ENDPOINTS.courses}/${id}`);
    return data;
  },
};

export default coursesService;
