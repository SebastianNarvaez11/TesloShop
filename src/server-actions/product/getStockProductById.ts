"use server";

import prisma from "@/lib/prisma";

export const getStockProductById = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
      select: {
        inStock: true,
      },
    });

    if (!product) return null;

    return product.inStock;
  } catch (error) {
    throw new Error("No se encontro el producto : stock");
  }
};
