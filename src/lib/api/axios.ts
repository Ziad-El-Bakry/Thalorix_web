export const axiosInstanceConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000",
  timeout: 15000,
};
