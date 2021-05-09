import axios from "axios";
import environment from "../config/environment";

export const httpClient = axios.create({
  baseURL: environment.api,
  withCredentials: true,
});
