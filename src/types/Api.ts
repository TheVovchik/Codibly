import { Product } from './Product';

interface Support {
  url: string,
  text: string,
}

export interface Api {
  page: number,
  per_page: number,
  total: number,
  total_pages: number,
  data: Product[],
  support: Support,
}
