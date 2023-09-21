import React from 'react';
import { createSelectable } from 'react-selectable-fast';
import cs from 'classnames';

const Item = (props) => {
  const { selectableRef, isSelected, isSelecting } = props;

  return (
    <div
      className={cs('time-period-selector-item', {
        selected: isSelected || props.value.isSelected,
        selecting: isSelecting,
        'not-selectable': props.title || props.title === 0,
      })}
      ref={selectableRef}
    >
      {props.title}
    </div>
  );
};

export default createSelectable(Item);
