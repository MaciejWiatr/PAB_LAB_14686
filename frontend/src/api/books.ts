import axios from "axios";
import { BASE_URL } from "./global";
import { GetResponseType } from "@/types/backend.helper";

export const getAllBooks = async () =>
  (await axios.get<GetResponseType<"/books", "get">>(BASE_URL + "/books")).data;
