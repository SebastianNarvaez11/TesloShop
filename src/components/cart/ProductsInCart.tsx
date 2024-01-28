"use client";

import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ProductsInCartSkeleton, QuantitySelector } from "..";

export const ProductsInCart = () => {
  const { cart, updateProductQuantity, removeProduct } = useCartStore(
    (state) => state
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <ProductsInCartSkeleton />
      ) : (
        <>
          {cart.map((product) => (
            <div key={product.slug + product.size} className="flex mb-5">
              <Image
                src={`/products/${product.image}`}
                width={100}
                height={100}
                style={{
                  width: "100px",
                  height: "100px",
                }}
                alt={product.title}
                className="mr-5 rounded"
              />

              <div>
                <Link
                  href={`/product/${product.slug}`}
                  className="hover:underline"
                >
                  {product.size} - {product.title}
                </Link>
                <p>${product.price}</p>
                <QuantitySelector
                  quantity={product.quantity}
                  setQuantity={(quantity) =>
                    updateProductQuantity(product, quantity)
                  }
                />

                <button
                  onClick={() => removeProduct(product)}
                  className="underline mt-3"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};
