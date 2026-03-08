import client from "./client";

export const authService = {
  login: async (payload) => {
    const { data } = await client.post("/auth/login", payload);
    return data;
  },
  register: async (payload) => {
    const { data } = await client.post("/auth/register", payload);
    return data;
  },
  profile: async () => {
    const { data } = await client.get("/user/profile");
    return data;
  },
};
