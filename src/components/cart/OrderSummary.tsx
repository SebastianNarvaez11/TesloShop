"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "../../store/cart/cartStore";
import { OrderSummarySkeleton } from "..";
import { currencyFormat } from "../../utils/currencyFormat";
import { useRouter } from "next/navigation";

export const OrderSummary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (itemsInCart === 0 && isLoading === false) {
      router.replace("/empty");
    }
  }, [itemsInCart, isLoading]);

  return (
    <>
      {isLoading ? (
        <OrderSummarySkeleton />
      ) : (
        <div className="grid grid-cols-2">
          <span>No. Productos</span>
          <span className="text-right">{itemsInCart} artículos</span>

          <span>Subtotal</span>
          <span className="text-right">{currencyFormat(subTotal)}</span>

          <span>Impuestos (15%)</span>
          <span className="text-right">{currencyFormat(tax)}</span>

          <span className="mt-5 text-2xl">Total:</span>
          <span className="mt-5 text-2xl text-right">
            {currencyFormat(total)}
          </span>
        </div>
      )}
    </>
  );
};
