"use client";

import { titleFont } from "@/config/fonts";
import { getStockProductById } from "@/server-actions";
import React, { FC, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

interface Props {
  id: string;
}

export const ProductStock: FC<Props> = ({ id }) => {
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStock = async () => {
      const stock = await getStockProductById(id);
      setStock(stock || 0);
      setLoading(false);
    };
    getStock();
  }, [id]);

  return (
    <>
      {loading ? (
        <Skeleton height={24} />
      ) : (
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          Stock: {stock}
        </h1>
      )}
    </>
  );
};
