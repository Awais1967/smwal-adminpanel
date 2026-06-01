import http from "./http";
import { ENDPOINTS } from "./endpoints";

const authService = {
  async login(payload) {
    const { data } = await http.post(ENDPOINTS.auth.login, payload);
    return data; // { token, user }
  },
  async me() {
    const { data } = await http.get(ENDPOINTS.auth.me);
    return data;
  },
  async logout() {
    const { data } = await http.post(ENDPOINTS.auth.logout);
    return data;
  },
};

export default authService;
