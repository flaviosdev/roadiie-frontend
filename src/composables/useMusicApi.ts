import axios from 'axios';
import type { Music } from '@/types/music.ts';

const base = 'http://localhost:8080/music';

export function useMusicApi() {

  const findAll = () =>
    axios.get<Music[]>(base);

  const findById = (id: string) =>
    axios.get<Music>(`${base}/${id}`);

  const create = (data: Music) =>
    axios.post<Music>(base, data);

  const update = (id: string, data: Music) =>
    axios.put<Music>(`${base}/${id}`, data);

  const deletee = (id: string) => axios.delete<Music>(`${base}/${id}`);

  return { findAll, findById, create, update, deletee };
}
