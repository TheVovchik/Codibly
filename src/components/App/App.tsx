import React, {
  FC, useEffect, useCallback, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from 'react-router-dom';
import * as productsActions from '../../features/products';
import * as filtredActions from '../../features/filtred';
import * as selectedActions from '../../features/selected';
import { useAppSelector } from '../../store/hooks';
import { Product } from '../../types/Product';
import './App.scss';
import { Table } from '../Table';
import { Loader } from '../Loader';
import { ModalWindow } from '../ModalWindow';
import { AppDispatch } from '../../store/store';

export const App: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useAppSelector(state => state.products);
  const {
    filtred, query, page, rowsPerPage, visible,
  } = useAppSelector(state => state.filtred);
  const { selected, selectedId } = useAppSelector(state => state.selected);

  const [searchParams, setSearchParams] = useSearchParams();

  const isTable = useMemo(() => (
    !loading && !error && visible.length !== 0
  ), [loading, error, visible]);

  const handleInput = ( // controled input function
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.target.value;

    dispatch(filtredActions.actions.addQuery(input));
  };

  const clearInput = useCallback(() => { // clear Button handler
    dispatch(filtredActions.actions.addQuery(''));
  }, []);

  useEffect(() => { // when data is loaded we need to filter it depending on query
    dispatch(filtredActions.actions.setPage(0));
    dispatch(filtredActions.actions.setFiltred(products));
  }, [products, query]); // we depends on products and query when we set filtred products

  useEffect(() => { // get initial query
    dispatch(productsActions.init());

    const initialSelectedId = searchParams.get('selectedId') ?? 0;
    const firstQuery = searchParams.get('query') ?? '';
    const initialPage = searchParams.get('page') ?? 0;
    const initialRows = searchParams.get('rows') ?? 5;

    dispatch(filtredActions.actions.addQuery(firstQuery));
    dispatch(filtredActions.actions.setPage(+initialPage));
    dispatch(filtredActions.actions.setRows(+initialRows));
    dispatch(selectedActions.actions.setSelectedId(+initialSelectedId));
  }, []);

  const handleChangePage = ( // pagination page change handler
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    dispatch(filtredActions.actions.setPage(newPage));
  };

  const handleChangeRowsPerPage = ( // set pagination rows per page handler
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const rows = parseInt(event.target.value, 10);

    dispatch(filtredActions.actions.setRows(rows));
    dispatch(filtredActions.actions.setPage(0));
  };

  useEffect(() => {
    dispatch(filtredActions.actions.setVisible());
  }, [filtred, page, rowsPerPage]); // we need change showed product when we change page or rows per page or we have query

  useEffect(() => { // set selected product if we have it in query on load after getting products from api
    if (selectedId) {
      const currentSelected = products[selectedId - 1];

      dispatch(selectedActions.actions.initiateSelected(currentSelected));
    }
  }, [products]);

  useEffect(() => { // refresh general query
    setSearchParams(() => {
      const newQuery = new URLSearchParams();

      if (query) {
        newQuery.append('query', query);
      }

      if (selected) {
        newQuery.append('selectedId', `${selectedId}`);
      }

      if (isTable) {
        newQuery.append('page', `${page + 1}`);
        newQuery.append('rows', `${rowsPerPage}`);
      }

      return newQuery;
    });
  }, [query, page, rowsPerPage, selected, isTable]);

  const selectProduct = (product: Product) => { // select product handler
    dispatch(selectedActions.actions.addSelected(product));
  };

  const deselectProduct = () => { // close modal window
    dispatch(selectedActions.actions.removeSelected());
  };

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
      {loading && <Loader />}

      {error && ( // every error will show user this text
        <div className="app__error">
          Something went wrong
        </div>
      )}

      {!isTable && ( // every error will show user this text
        <div className="app__error">
          No corresponding data
        </div>
      )}

      {/* Table with pagination will be shown after load if no error */}
      {isTable
        && (
          <>
            <Table
              products={visible}
              selectProduct={selectProduct}
            />

            <TablePagination
              component="div"
              count={filtred.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
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
