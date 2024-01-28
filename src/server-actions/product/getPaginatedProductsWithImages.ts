"use server";

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";
import { notFound } from "next/navigation";

interface IPaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: IPaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    // 1. obtener productos
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
      where: {
        gender: gender,
      },
    });

    if (!products) {
      return notFound();
    }

    //2. obtener el numero total de productos para saber cuantas paginas hay
    const totalCount = await prisma.product.count({
      where: { gender: gender },
    });
    const totalPage = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages: totalPage,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (error) {
    throw new Error("Error al cargar los productos");
  }
};
