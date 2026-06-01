import http from "./http";
import { ENDPOINTS } from "./endpoints";

const dashboardService = {
  async summary(params) {
    const { data } = await http.get(ENDPOINTS.dashboard, { params });
    return data;
  },
};

export default dashboardService;
