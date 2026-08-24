import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api.types";
import type { UploadedFile } from "@/types/upload.types";

export const uploadsService = {
  uploadSingle: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient
      .post<ApiResponse<UploadedFile>>(API_ENDPOINTS.uploads.single, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
};
