import http from "./http";
import { ENDPOINTS } from "./endpoints";
import { flattenTableParams, normalizeListResponse } from "./apiUtils";

const settingsService = {
  async getBasic() {
    const { data } = await http.get(ENDPOINTS.settings.basic);
    return data;
  },
  async updateBasic(payload) {
    const { data } = await http.put(ENDPOINTS.settings.basic, payload);
    return data;
  },

  async listMembers(params) {
    const { data } = await http.get(ENDPOINTS.settings.members, {
      params: flattenTableParams(params),
    });
    return normalizeListResponse(data);
  },
  async createMember(payload) {
    const { data } = await http.post(ENDPOINTS.settings.members, payload);
    return data;
  },
  async updateMember(id, payload) {
    const { data } = await http.put(
      `${ENDPOINTS.settings.members}/${id}`,
      payload,
    );
    return data;
  },
  async removeMember(id) {
    const { data } = await http.delete(`${ENDPOINTS.settings.members}/${id}`);
    return data;
  },

  async getEmailSettings() {
    const { data } = await http.get(ENDPOINTS.settings.email);
    return data;
  },
  async updateEmailSettings(payload) {
    const { data } = await http.put(ENDPOINTS.settings.email, payload);
    return data;
  },

  async changePassword(payload) {
    const { data } = await http.post(
      ENDPOINTS.settings.changePassword,
      payload,
    );
    return data;
  },
};

export default settingsService;
