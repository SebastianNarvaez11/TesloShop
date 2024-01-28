import React, { FC } from "react";
import {
  AddToCart,
  ProductMobileSlideshow,
  ProductSlideshow,
  ProductStock,
  QuantitySelector,
  SizeSelector,
} from "@/components";
import { titleFont } from "@/config/fonts";
import { getProductBySlug } from "@/server-actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const product = await getProductBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product?.title || "Producto no encontrado",
    description: product?.description || "",
    openGraph: {
      title: product?.title || "Producto no encontrado",
      description: product?.description || "",
      images: [`/products/${product?.images[0]}`],
    },
  };
}

const ProductPage: FC<Props> = async ({ params }) => {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* slideshow */}
      <div className="col-span-1 md:col-span-2">
        <ProductSlideshow
          images={product.images}
          title={product.title}
          className="hidden md:block"
        />
        <ProductMobileSlideshow
          images={product.images}
          title={product.title}
          className="block md:hidden"
        />
      </div>
      {/* detalles */}
      <div className="col-span-1 px-5">
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>

        <p className="text-lg mb-5"> ${product.price}</p>

        <ProductStock id={product.id} />

        <AddToCart product={product} />

        {/* descripcion */}
        <h3 className="font-bold text-sm">Description</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductPage;
