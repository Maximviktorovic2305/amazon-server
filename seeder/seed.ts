import { faker } from '@faker-js/faker';
import { PrismaClient, Product } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

const createProducts = async (quantity: number) => {
  const products: Product[] = [];

  for (let i = 0; i < quantity; i++) {
    const productName = faker.commerce.productName();
    const categoryName = faker.commerce.department();

    const product = await prisma.product.create({
      data: {
        name: productName,
        description: faker.lorem.paragraph(),
        slug: faker.lorem.word(),
        price: +faker.number.int({ min: 100, max: 9999 }),
        images: Array.from({ length: faker.number.int({ min: 2, max: 6}) }).map(() =>
        faker.image.urlLoremFlickr({ category: 'food' }),
        ),
        category: {
          create: {
            name: categoryName,
          },
        },
        reviews: {
          create: [
            {
              rating: faker.number.int({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: { connect: { id: 1 } },
            },
            {
              rating: faker.number.int({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: { connect: { id: 2 } },
            },
          ],
        },
      },
    });
    products.push(product);
  }

};

async function main() {
  console.log('Start seeding...');
  await createProducts(20);
}

main()
  .catch((e) => console.log(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
