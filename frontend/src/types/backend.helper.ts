import { paths } from "./backend";

// Helper type to extract the response type from an operation
type ExtractResponseType<T> = T extends { responses: infer U } ? U : never;

// Extract the correct response type based on the HTTP method
type MethodResponse<T, M> = M extends keyof T
  ? ExtractResponseType<T[M]>
  : never;

// Extract the correct content type from the response (focusing on happy path, usually 200 or 201)
type ExtractJsonResponse<R> = R extends { 200: { content: infer U } }
  ? U
  : R extends { 201: { content: infer U } }
  ? U
  : never;

// Extract the 'application/json' type from the content
type JsonResponseContentType<C> = C extends { "application/json": infer U }
  ? U
  : never;

type ValidPath = keyof paths;
type ValidMethod<Path extends ValidPath> = keyof paths[Path];

export type GetResponseType<
  Path extends ValidPath,
  Method extends ValidMethod<Path>
> = JsonResponseContentType<
  ExtractJsonResponse<MethodResponse<paths[Path], Method>>
>;
