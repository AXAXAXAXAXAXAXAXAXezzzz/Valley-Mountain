import client from "./client";

export const supportService = {
  getAll: async () => {
    const { data } = await client.get("/support");
    return data;
  },
  create: async (payload) => {
    const { data } = await client.post("/support", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await client.patch(`/support/${id}`, payload);
    return data;
  },
};
