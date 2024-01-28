export const revalidate = 60;

import { Pagination, ProductsGrid, Title } from "@/components";
import { getPaginatedProductsWithImages } from "@/server-actions";
import { Gender } from "@prisma/client";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import React, { FC } from "react";

interface Props {
  params: {
    gender: Gender;
  };
  searchParams: {
    page: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gender } = params;

  return {
    title: gender || "Producto no encontrado",
    description: gender || "",
  };
}

const GenderPage: FC<Props> = async ({ params, searchParams }) => {
  const { gender } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const labels: Record<Gender, string> = {
    men: "para hombres",
    women: "para mujeres",
    kid: "para niños",
    unisex: "para todos",
  };

  const { products, totalPages } = await getPaginatedProductsWithImages({
    gender,
    page,
  });

  // if (id === "kid") {
  //   notFound();
  // }

  if (products.length === 0) {
    redirect("/");
  }

  return (
    <>
      <Title
        title={`Artículos de ${labels[gender]}`}
        subtitle="todos los productos"
        className="mb-2"
      />
      <ProductsGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
};

export default GenderPage;
