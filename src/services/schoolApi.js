import api from "./api";

export const schoolApi = {
  getAll: () => api.get("/schools"),
};