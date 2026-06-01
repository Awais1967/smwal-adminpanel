import http from "./http";
import { ENDPOINTS } from "./endpoints";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validateUploadFile(file, { accept = [], maxSize = MAX_FILE_SIZE } = {}) {
  if (!file) return null;
  if (accept.length && !accept.some((type) => file.type?.startsWith(type))) {
    throw new Error("Unsupported file type.");
  }
  if (file.size > maxSize) {
    throw new Error("File is too large.");
  }
  return file;
}

const uploadService = {
  async upload(file, folder = "uploads") {
    validateUploadFile(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const { data } = await http.post(ENDPOINTS.uploads, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },
};

export default uploadService;
