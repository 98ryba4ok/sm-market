import axios from "./axios";
import type { Brand } from "../types";

export const brandsApi = {
  list: () => axios.get<Brand[]>("/catalog/brands/"),
  retrieve: (slugOrId: string | number) =>
    axios.get<Brand>(`/catalog/brands/${slugOrId}/`),
};
