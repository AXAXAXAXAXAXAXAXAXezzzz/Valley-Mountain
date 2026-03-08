import client from "./client";

export const productService = {
  getAll: async (params = {}) => {
    try {
      const { data } = await client.get("/products", { params });
      return data;
    } catch (error) {
      if (error?.code === "API_UNAVAILABLE" || error?.code === "ERR_NETWORK") return [];
      throw error;
    }
  },
  getOne: async (id) => {
    try {
      const { data } = await client.get(`/products/${id}`);
      return data;
    } catch (error) {
      if (error?.code === "API_UNAVAILABLE" || error?.code === "ERR_NETWORK") return null;
      throw error;
    }
  },
  create: async (payload) => {
    const { data } = await client.post("/products", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await client.put(`/products/${id}`, payload);
    return data;
  },
  remove: async (id) => {
    const { data } = await client.delete(`/products/${id}`);
    return data;
  },
};
