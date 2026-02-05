import axios from "axios";

const api = axios.create({
  baseURL: "https://mitransh.onrender.com/", // your deployed backend
});

export default api; //  now matches