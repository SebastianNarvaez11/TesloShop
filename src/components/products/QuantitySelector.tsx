"use client";

import React, { FC, useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  setQuantity: (value: number) => void;
}

export const QuantitySelector: FC<Props> = ({ quantity, setQuantity }) => {
  const changeQuantity = (quantity: number) => {
    if (quantity < 1) return;

    setQuantity(quantity);
  };

  return (
    <div className="flex">
      <button onClick={() => changeQuantity(quantity - 1)}>
        <IoRemoveCircleOutline size={30} />
      </button>

      <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded">
        {quantity}
      </span>

      <button onClick={() => changeQuantity(quantity + 1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
};
