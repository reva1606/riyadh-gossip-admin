/** Mirrors the backend's `UploadedFileResponseDto` (POST /uploads/single, /uploads/multiple). */
export interface UploadedFile {
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  /** Relative URL under the API's /uploads/ static prefix — prefix with env.apiUrl to render. */
  url: string;
}
