import http from "./http";
import { ENDPOINTS } from "./endpoints";
import { flattenTableParams, normalizeListResponse } from "./apiUtils";

const billingService = {
  async list(params) {
    const { data } = await http.get(ENDPOINTS.billing, {
      params: flattenTableParams(params),
    });
    return normalizeListResponse(data);
  },
  async getById(id) {
    const { data } = await http.get(`${ENDPOINTS.billing}/${id}`);
    return data;
  },
  async remove(id) {
    const { data } = await http.delete(`${ENDPOINTS.billing}/${id}`);
    return data;
  },

  // Optional chart endpoints (if backend supports)
  async revenueBreakdown(params) {
    const { data } = await http.get(`${ENDPOINTS.billing}/revenue-breakdown`, {
      params,
    });
    return data;
  },
  async revenueOverview(params) {
    const { data } = await http.get(`${ENDPOINTS.billing}/revenue-overview`, {
      params,
    });
    return data;
  },
};

export default billingService;
