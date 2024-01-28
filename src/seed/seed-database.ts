import { initialData } from "./seed";
import prisma from "../lib/prisma";

const main = async () => {
  const { categories, products, users } = initialData;
  //   await Promise.all([
  await prisma.user.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  //   ]);

  await prisma.user.createMany({ data: users });

  const categoriesData = categories.map((category) => ({
    name: category,
  }));

  await prisma.category.createMany({ data: categoriesData });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLocaleLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>);

  await Promise.all(
    products.map(async (product) => {
      const { images, type, ...rest } = product;
      const productDB = await prisma.product.create({
        data: { ...rest, categoryId: categoriesMap[type] },
      });

      const imagesDB = images.map((img) => ({
        productId: productDB.id,
        url: img,
      }));

      await prisma.productImage.createMany({
        data: imagesDB,
      });
    })
  );
};

(() => {
  main();
})();
