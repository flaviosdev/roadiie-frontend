import axios from 'axios';
import type { Upload } from '@/types/upload.ts';

const base = 'http://localhost:8080/upload';

export function useUploadApi() {

  const findAll = () =>
    axios.get<Upload[]>(base);

  const findById = (id: string) =>
    axios.get<Upload>(`${base}/${id}`);

  const create = (data: Upload) =>
    axios.post<Upload>(base, data);

  const update = (id: string, data: Upload) =>
    axios.put<Upload>(`${base}/${id}`, data);

  const deletee = (id: string) => axios.delete<Upload>(`${base}/${id}`);

  return { findAll, findById, create, update, deletee };
}
