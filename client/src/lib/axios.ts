import axios from "axios";
const serverBaseUrl = process.env.NEXT_SERVER_BASE_URL;
export const api = axios.create({
  baseURL: serverBaseUrl ? `${serverBaseUrl}/api` : "http://localhost:5000/api",
  withCredentials: true,
});
