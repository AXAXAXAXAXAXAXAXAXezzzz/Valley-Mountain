import client from "./client";

export const orderService = {
  getAll: async () => {
    try {
      const { data } = await client.get("/orders");
      return data;
    } catch (error) {
      if (error?.code === "API_UNAVAILABLE" || error?.code === "ERR_NETWORK") return [];
      throw error;
    }
  },
  create: async (payload) => {
    const { data } = await client.post("/orders", payload);
    return data;
  },
};
