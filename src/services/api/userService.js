import client from "./client";

export const userService = {
  getAll: async () => {
    const { data } = await client.get("/users");
    return data;
  },
  create: async (payload) => {
    const { data } = await client.post("/users", payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await client.delete(`/users/${id}`);
    return data;
  },
};
