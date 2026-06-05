import api from "../api/api";
import type { RegisterPayload } from "../types/auth";

export const registerUser = async (data: RegisterPayload) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};