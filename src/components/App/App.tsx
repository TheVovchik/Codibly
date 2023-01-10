/* eslint-disable no-console */
import React, {
  FC, useEffect, useState, useCallback,
} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../../types/Product';
import { getProducts } from '../../api/api';
import './App.scss';
import { Table } from '../Table';
import { Loader } from '../Loader';
import { ModalWindow } from '../ModalWindow';

export const App: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [filtred, setFiltred] = useState<Product[]>([]);
  const [visible, setVisible] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => { // get initial query
    const selectedId = searchParams.get('selectedId');

    if (selectedId) {
      setSelected(products[+selectedId]);
    }

    setQuery(searchParams.get('query') ?? '');

    const initialPage = searchParams.get('page');
    const initialRows = searchParams.get('rows');

    if (initialPage) {
      setPage(+initialPage ?? 0);
    }

    if (initialRows) {
      setRowsPerPage(+initialRows ?? 5);
    }
  }, []);

  const loadData = useCallback(async () => { // load data drom API
    setHasError(false);

    try {
      setIsLoading(true);
      const dataFromApi = await getProducts();

      setProducts(dataFromApi);
    } catch (error) {
      setHasError(true);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => { // load data will be triggered once only on component first render
    loadData();
  }, []);

  const handleInput = ( // controled input function
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.target.value.replace(/\D/g, ''); // leave only digits

    setQuery(input);
  };

  useEffect(() => { // refresh general query
    setSearchParams(() => {
      const newQuery = new URLSearchParams();

      if (query) {
        newQuery.append('query', query);
      }

      if (selected) {
        newQuery.append('selectedId', `${selected.id}`);
      }

      newQuery.append('page', `${page}`);
      newQuery.append('rows', `${rowsPerPage}`);

      return newQuery;
    });
  }, [query, page, rowsPerPage, selected]);

  const clearInput = () => { // clear Button handler
    setQuery('');
  };

  const selectProduct = (product: Product) => { // select product handler
    setSelected(product);
  };

  const deselectProduct = () => { // close modal window
    setSelected(null);
  };

  const handleChangePage = ( // pagination page change handler
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = ( // set pagination rows per page handler
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const rows = parseInt(event.target.value, 10);

    setRowsPerPage(rows);
    setPage(0);
  };

  const showProducts = useCallback(() => { // final table with query and pagination
    const start = +rowsPerPage * +page;
    let end = start + +rowsPerPage;

    end = end > filtred.length ? filtred.length : end;

    const visibleProducts = filtred
      .slice(start, end);

    setVisible(visibleProducts);
  }, [rowsPerPage, page, filtred]);

  useEffect(() => { // when data is loaded we have need to filter or not it depending on query
    setPage(0);

    let filtredProducts = products;

    if (query) { // if we have query we filter
      filtredProducts = filtredProducts
        .filter(product => product.id === +query); // query is string, need to do typecasting
    }

    setFiltred(filtredProducts);
  }, [products, query]); // we depends on products and query when we set filtred products

  useEffect(() => {
    showProducts();
  }, [filtred, page, rowsPerPage]); // we need change showed product when we change page or rows per page or we have query

  return (
    <div className="box app">
      <div className="app__header">
        {/* Box for the input and icon */}
        <Box sx={{
          display: 'flex',
          alignItems: 'flex-end',
          width: '100%',
        }}
        >
          <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            id="input-with-sx"
            label="Color id"
            variant="standard"
            value={query}
            onChange={handleInput}
          />
        </Box>

        {/* Button to clear input */}
        <button
          type="button"
          className="button is-info"
          onClick={clearInput}
        >
          Clear
        </button>
      </div>

      {/* loader on data load */}
      {isLoading && <Loader />}

      {hasError && ( // every error will show user this text
        <div className="app__error">
          Something went wrong
        </div>
      )}

      {/* Table with pagination will be shown after load if no error */}
      {!isLoading
        && !hasError
        && (
          <>
            <Table
              products={visible}
              selectProduct={selectProduct}
            />

            <TablePagination
              component="div"
              count={filtred.length}
              page={+page}
              onPageChange={handleChangePage}
              rowsPerPage={+rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[1, 2, 5, 10]}
            />
          </>
        )}

      {/* Modal window will appear on Product selection */}
      {selected && (
        <ModalWindow
          selected={selected}
          deselectProduct={deselectProduct}
        />
      )}
    </div>
  );
};
