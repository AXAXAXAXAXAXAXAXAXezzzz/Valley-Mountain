import client from "./client";

const abs = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await client.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return abs(data.imageUrl);
  },
};
