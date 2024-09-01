export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  error: string | null;
  timestamp: string;
  path: string;
  data: T | null;
}
