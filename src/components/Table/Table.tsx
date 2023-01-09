/* eslint-disable @typescript-eslint/naming-convention */
import { FC } from 'react';
import { Product } from '../../types/Product';

type Props = {
  products: Product[],
  selectProduct: (product: Product) => void,
};

export const Table: FC<Props> = ({
  products, selectProduct,
}) => {
  const handleSelection = (product: Product) => {
    selectProduct(product);
  };

  return (
    <table className="table is-bordered is-fullwidth app__table">
      <thead className="table__head">
        <tr>
          <th className="table__head-value">Id</th>
          <th className="table__head-value">Name</th>
          <th className="table__head-value">Year</th>
          <th className="table__head-value">Color</th>
          <th className="table__head-value">Pantone value</th>
        </tr>
      </thead>

      <tbody>
        {products.map(product => {
          const {
            id,
            name,
            year,
            color,
            pantone_value,
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
              <td>{color}</td>
              <td>{pantone_value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
