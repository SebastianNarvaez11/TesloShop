import { ICartProduct } from "@/interfaces";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IStore {
  cart: ICartProduct[];
  getTotalItems: () => number;
  addProductToCart: (product: ICartProduct) => void;
  removeProduct: (product: ICartProduct) => void;
  updateProductQuantity: (product: ICartProduct, quantity: number) => void;
  getSummaryInformation: () => {
    tax: number;
    subTotal: number;
    total: number;
    itemsInCart: number;
  };
}

export const useCartStore = create<IStore>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],

        getTotalItems: () => {
          const { cart } = get();
          return cart.reduce((total, item) => total + item.quantity, 0);
        },

        getSummaryInformation: () => {
          const { cart } = get();

          const subTotal = cart.reduce(
            (subtotal, product) => product.quantity * product.price + subtotal,
            0
          );

          const tax = subTotal * 0.15;
          const total = subTotal + tax;
          const itemsInCart = cart.reduce(
            (total, item) => total + item.quantity,
            0
          );

          return { tax, subTotal, total, itemsInCart };
        },

        updateProductQuantity: (product: ICartProduct, quantity: number) => {
          const { cart } = get();

          const updateCartProducts = cart.map((item) => {
            if (item.id === product.id && item.size === product.size) {
              return { ...item, quantity: quantity };
            }
            return item;
          });

          set({ cart: updateCartProducts });
        },

        removeProduct: (product: ICartProduct) => {
          const { cart } = get();

          const newCart = cart.filter(
            (item) => item.id !== product.id || item.size !== product.size
          );

          set({
            cart: newCart,
          });
        },

        addProductToCart: (product: ICartProduct) => {
          const { cart } = get();

          // 1. revisar si el producto existe en el carrito con la talla seleccionada
          const productInCart = cart.some(
            (item) => item.id === product.id && item.size === product.size
          );

          if (!productInCart) {
            return set({ cart: [...cart, product] });
          }

          // 2. si existe el producto por talla, entonces incremento la cantidad
          const updateCartProducts = cart.map((item) => {
            if (item.id === product.id && item.size === product.size) {
              return { ...item, quantity: item.quantity + product.quantity };
            }
            return item;
          });

          set({ cart: updateCartProducts });
        },
      }),
      { name: "shopping-cart" }
    )
  )
);
