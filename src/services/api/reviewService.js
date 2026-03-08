import client from "./client";

export const reviewService = {
  getAll: async (params = {}) => {
    const { data } = await client.get("/reviews", { params });
    return data;
  },
  create: async (payload) => {
    const { data } = await client.post("/reviews", payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await client.delete(`/reviews/${id}`);
    return data;
  },
};
