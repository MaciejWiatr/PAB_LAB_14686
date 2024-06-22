import { components } from "@/types/backend";
import { api } from "./client.global";
import { GetSchema } from "@/types/backend.helper";

export const apiGetAllBooks = () => api.GET("/books");

export const apiCreateBook = (body: components["schemas"]["CreateBookDto"]) =>
  api.POST("/books", { body });

export const apiRemoveBook = (d: { id: string }) =>
  api.DELETE("/books/{id}", { params: { path: d } });

export const apiUpdateBook = (d: {
  id: string;
  data: GetSchema<"UpdateBookDto">;
}) =>
  api.PATCH("/books/{id}", { params: { path: { id: d.id } }, body: d.data });
