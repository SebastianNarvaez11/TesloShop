import { initialData } from "./seed";
import prisma from "../lib/prisma";
import { countries } from "./seed-countries";

const main = async () => {
  const { categories, products, users } = initialData;
  //   await Promise.all([
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  //   ]);

  await prisma.user.createMany({ data: users });

  await prisma.country.createMany({
    data: countries,
  });

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
