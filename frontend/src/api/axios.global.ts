"use client";

import { getToken } from "@/helpers/auth.helper";
import axios from "axios";

axios.interceptors.request.use((c) => {
  const token = getToken();

  if (!token) return c;

  c.headers.Authorization = `Bearer ${token}`;

  return c;
});
