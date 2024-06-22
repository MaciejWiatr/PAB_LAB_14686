import { api } from "./client.global";

export const apiCreateReview = (data: {
  rating: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}) =>
  api.POST("/reviews", {
    body: data,
  });

export const apiRemoveReview = (params: { id: string }) =>
  api.DELETE("/reviews/{id}", { params: { path: { id: params.id } } });

export const apiGetAllReviews = () => api.GET("/reviews");
