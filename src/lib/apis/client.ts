import axios from "axios";

const client = axios.create({
  baseURL:
    import.meta.env.VITE_PUBLIC_API_URL ||
    "https://3fe3-95-105-67-206.ngrok-free.app",
});

client.interceptors.request.use((config) => {
  console.log(localStorage.getItem("jwt"));
  if (localStorage.getItem("jwt")) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("jwt")}`;
  }
  config.headers["ngrok-skip-browser-warning"] = "true";
  return config;
});
export default client;
