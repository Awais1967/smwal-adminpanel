import http from "./http";
import { ENDPOINTS } from "./endpoints";
import { flattenTableParams, normalizeListResponse } from "./apiUtils";

const messagesService = {
  async list(params) {
    const { data } = await http.get(ENDPOINTS.messages.campaigns, {
      params: flattenTableParams(params),
    });
    return normalizeListResponse(data);
  },
  async getById(id) {
    const { data } = await http.get(`${ENDPOINTS.messages.campaigns}/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await http.post(ENDPOINTS.messages.campaigns, payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await http.put(
      `${ENDPOINTS.messages.campaigns}/${id}`,
      payload,
    );
    return data;
  },
  async remove(id) {
    const { data } = await http.delete(`${ENDPOINTS.messages.campaigns}/${id}`);
    return data;
  },
  async summary(params) {
    const { data } = await http.get(ENDPOINTS.messages.summary, { params });
    return data;
  },
};

export default messagesService;
