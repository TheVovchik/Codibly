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
  const [query, setQuery] = useState(searchParams.get('query') ?? '');

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [filtred, setFiltred] = useState<Product[]>([]);
  const [visible, setVisible] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);

  const [page, setPage] = useState(searchParams.get('page') ?? 0);
  const [rowsPerPage, setRowsPerPage] = useState(searchParams.get('rows') ?? 5);

  useEffect(() => {
    const selectedId = searchParams.get('selectedId');

    if (selectedId) {
      setSelected(products[+selectedId]);
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

    setSearchParams(current => {
      const newQuery = new URLSearchParams(current);

      if (!input) {
        if (newQuery.has('query')) {
          newQuery.delete('query');
        }

        return newQuery;
      }

      newQuery.append('query', input);

      return newQuery;
    });
  };

  const clearInput = () => { // clear Button handler
    setQuery('');
    setSearchParams(current => {
      const newQuery = new URLSearchParams(current);

      if (newQuery.has('query')) {
        newQuery.delete('query');
      }

      return newQuery;
    });
  };

  const selectProduct = (product: Product) => { // select product handler
    setSelected(product);

    setSearchParams(current => {
      const newQuery = new URLSearchParams(current);

      newQuery.append('selectedId', `${product.id}`);

      return newQuery;
    });
  };

  const deselectProduct = () => { // close modal window
    setSelected(null);

    setSearchParams(current => {
      const newQuery = new URLSearchParams(current);

      if (newQuery.has('selectedId')) {
        newQuery.delete('selectedId');
      }

      return newQuery;
    });
  };

  const handleChangePage = ( // pagination page change handler
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);

    setSearchParams(current => {
      const newQuery = new URLSearchParams(current);

      newQuery.delete('page');
      newQuery.append('page', `${newPage}`);

      return newQuery;
    });
  };

  const handleChangeRowsPerPage = ( // set pagination rows per page handler
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const rows = parseInt(event.target.value, 10);

    setRowsPerPage(rows);
    setPage(0);

    setSearchParams(current => {
      const newQuery = new URLSearchParams(current);

      newQuery.delete('page');
      newQuery.delete('rows');
      newQuery.append('page', '0');
      newQuery.append('rows', `${rows}`);

      return newQuery;
    });
  };

  const showProducts = () => { // final table with query and pagination
    const start = +rowsPerPage * +page;
    let end = start + +rowsPerPage;

    end = end > filtred.length ? filtred.length : end;

    const visibleProducts = filtred
      .slice(start, end);

    setVisible(visibleProducts);
  };

  useEffect(() => { // when data is loaded we have need to filter or not it depending on query
    setPage(0);

    setSearchParams(current => {
      const newQuery = new URLSearchParams(current);

      newQuery.delete('page');
      newQuery.delete('rows');
      newQuery.append('page', '0');
      newQuery.append('rows', `${rowsPerPage}`);

      return newQuery;
    });

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
