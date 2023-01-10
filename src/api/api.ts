import axios from 'axios';
import { Api } from '../types/Api';

const BASE_URL = 'https://reqres.in/api/products';

/*
we get all products in one call, so we don't need to
call after for every product id with get calls /:productId
we manage all data on the user side.
if we will have more data and more information about options
from api (can we filter on server and get only products we need etc.)
we should manage data using server posibilities and for modal
use single calls for wide data
*/
export const getProducts = async () => {
  return axios.get<Api>(BASE_URL)
    .then(responce => responce.data.data) // axios pack the Api object in data and our products also in data object
    .catch(() => { // an error that is trowed here, will be catched in load function
      throw new Error();
    });
};
