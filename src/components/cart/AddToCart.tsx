"use client";

import React, { FC, useState } from "react";
import { QuantitySelector, SizeSelector } from "..";
import { ICartProduct, IProduct, Size } from "@/interfaces";
import { useCartStore } from "@/store";

interface Props {
  product: IProduct;
}

export const AddToCart: FC<Props> = ({ product }) => {
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);

  const { addProductToCart } = useCartStore((state) => state);

  const addProducto = () => {
    setPosted(true);

    if (!size) return;

    const productCart: ICartProduct = {
      id: product.id,
      image: product.images[0],
      price: product.price,
      size: size,
      slug: product.slug,
      title: product.title,
      quantity: quantity,
    };

    addProductToCart(productCart);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500">Debe seleccionar una talla*</span>
      )}

      {/* tallas */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        setSize={setSize}
      />

      {/* cantidades */}
      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

      {/* boton */}
      <button onClick={addProducto} className="btn-primary my-5">
        Agregar al carrito
      </button>
    </>
  );
};
