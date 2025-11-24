import axios from 'axios';
import type { Music } from '@/types/Music';

const base = 'http://localhost:8080/music';

export function useMusicApi() {

  const findAll = () =>
    axios.get<Music[]>(base);

  const findById = (id: number) =>
    axios.get<Music>(`${base}/${id}`);

  const create = (data: Music) =>
    axios.post<Music>(base, data);

  const update = (id: number, data: Music) =>
    axios.put<Music>(`${base}/${id}`, data);

  return { findAll, findById, create, update };
}
