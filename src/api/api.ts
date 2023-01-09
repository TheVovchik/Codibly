import axios from 'axios';
import { Api } from '../types/Api';

const BASE_URL = 'https://reqres.in/api/products';

export const getProducts = async () => {
  return axios.get<Api>(BASE_URL)
    .then(responce => responce.data.data)
    .catch(() => {
      throw new Error();
    });
};
