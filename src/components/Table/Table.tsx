import { FC, memo, useCallback } from 'react';
import { Product } from '../../types/Product';

type Props = {
  products: Product[],
  selectProduct: (product: Product) => void,
};

export const Table: FC<Props> = memo(({
  products, selectProduct,
}) => {
  const handleSelection = useCallback(( // onclick we set selected product
    product: Product,
  ) => {
    selectProduct(product);
  }, []);

  return (
    <table className="table is-bordered app__table">
      <thead className="table__head">
        <tr>
          <th className="table__head-value">Id</th>
          <th className="table__head-value">Name</th>
          <th className="table__head-value">Year</th>
        </tr>
      </thead>

      <tbody>
        {products.map(product => {
          const {
            id,
            name,
            year,
            color,
          } = product;

          return (
            <tr
              key={id}
              style={{ backgroundColor: color }}
              className="is-selected"
              onClick={() => handleSelection(product)}
            >
              <td>{id}</td>
              <td>{name}</td>
              <td>{year}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
