export const revalidate = 60;

import { Pagination, ProductsGrid, Title } from "@/components";
import { getPaginatedProductsWithImages } from "@/server-actions";
import { notFound } from "next/navigation";

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
  });

  if (products.length === 0) {
    notFound();
  }

  return (
    <>
      <Title title="Tienda" subtitle="todos los productos" className="mb-2" />
      <ProductsGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
