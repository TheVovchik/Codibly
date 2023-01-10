/* eslint-disable @typescript-eslint/naming-convention */
import { FC, useMemo } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import NumbersSharpIcon from '@mui/icons-material/NumbersSharp';
import cn from 'classnames';
import { Product } from '../../types/Product';
import './ModalWindow.scss';

type Props = {
  selected: Product,
  deselectProduct: () => void,
};

export const ModalWindow: FC<Props> = ({
  selected,
  deselectProduct,
}) => {
  const {
    id,
    name,
    year,
    color,
    pantone_value,
  } = selected;

  /* initial selected is null so is Active = false
  and when and only we set product to selected we recalculate isActive
  value to show modal window
  */
  const isActive = useMemo(() => Boolean(id), [selected]);

  return (
    <div className={cn(
      'modal',
      { 'is-active': isActive },
    )}
    >
      <div
        className="modal-background"
        style={{ backgroundColor: color }}
      />

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{name.toUpperCase()}</p>
          <button
            type="button"
            className="delete"
            aria-label="close"
            onClick={deselectProduct}
          />
        </header>

        <section
          className="modal-card-body"
        >
          <div className="modal-card-body__field">
            <NumbersSharpIcon
              sx={{ color: 'action.active', mr: 1, my: 0.5 }}
            />
            {`Id: ${id}`}
          </div>
          <div className="modal-card-body__field">
            <CalendarTodayIcon
              sx={{ color: 'action.active', mr: 1, my: 0.5 }}
            />
            {`Year: ${year}`}
          </div>
          <div className="modal-card-body__field">
            <PaletteOutlinedIcon
              sx={{ color: 'action.active', mr: 1, my: 0.5 }}
            />
            {`Color: ${color}`}
          </div>
          <div className="modal-card-body__field">
            <ColorLensIcon
              sx={{ color: 'action.active', mr: 1, my: 0.5 }}
            />
            {`Pantone value: ${pantone_value}`}
          </div>
        </section>
      </div>
    </div>
  );
};
