"use client";

import { paths } from "@/types/backend";
import createClient, { Middleware } from "openapi-fetch";
import { BASE_URL } from "./global";
import { getToken } from "@/helpers/auth.helper";

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const token = getToken();

    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }

    return request;
  },
};

export const api = createClient<paths>({ baseUrl: BASE_URL });
api.use(authMiddleware);
