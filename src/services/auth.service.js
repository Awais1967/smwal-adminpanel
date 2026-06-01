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
  async forgotPassword(payload) {
    const { data } = await http.post(ENDPOINTS.auth.forgotPassword, payload);
    return data;
  },
  async resetPassword(payload) {
    const { data } = await http.post(ENDPOINTS.auth.resetPassword, payload);
    return data;
  },
  async create(payload) {
    const { data } = await http.post(ENDPOINTS.auth.create, payload);
    return data;
  },
};

export default authService;
