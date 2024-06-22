import { api } from "./client.global";

export const signIn = (d: { username: string; password: string }) =>
  api.POST("/auth/login", {
    body: d,
  });

export const currentUser = () => api.GET("/users/current");

export const register = (d: { username: string; password: string }) =>
  api.POST("/auth/register", { body: d });

export const apiAllUsers = () => api.GET("/users");

export const apiCreateUser = (data: {
  username: string;
  password: string;
  role: "USER" | "ADMIN";
}) =>
  api.POST("/users", {
    body: data,
  });

export const apiGetAllUsers = () => api.GET("/users");

export const apiRemoveUser = (params: { id: string }) =>
  api.DELETE("/users/{id}", {
    params: {
      path: {
        id: params.id,
      },
    },
  });

export const apiUpdateUser = (params: {
  id: string;
  data: { username?: string; role?: "USER" | "ADMIN"; password?: string };
}) =>
  api.PATCH("/users/{id}", {
    params: {
      path: {
        id: params.id,
      },
    },
    body: params.data,
  });
