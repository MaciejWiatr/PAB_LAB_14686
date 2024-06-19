import axios from "axios";
import { BASE_URL } from "./global";
import { GetResponseType } from "@/types/backend.helper";

export const signIn = async (d: { username: string; password: string }) =>
  axios.post<GetResponseType<"/auth/login", "post">>(
    BASE_URL + "/auth/login",
    d
  );

export const currentUser = async () =>
  axios.get<GetResponseType<"/users/current", "get">>(
    BASE_URL + "/users/current"
  );
