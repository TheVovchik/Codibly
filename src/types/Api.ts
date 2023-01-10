import { Product } from './Product';

interface Support { // support object interface
  url: string,
  text: string,
}

export interface Api { // general data from api interface
  page: number,
  per_page: number,
  total: number,
  total_pages: number,
  data: Product[],
  support: Support,
}
