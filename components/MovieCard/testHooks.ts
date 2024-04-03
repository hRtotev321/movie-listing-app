import { faker } from "@faker-js/faker";
import { MovieType } from "static/types";

export const getMovie = (): MovieType => {
  return {
    comments: [
      {
        author: faker.animal.cow(),
        comment: faker.string.alphanumeric({ length: 22 }),
        rating: Number(faker.number.octal({ min: 1, max: 5 })),
      },
    ],
    creator: faker.animal.bird(),
    description: faker.string.alphanumeric({ length: 27 }),
    genre: faker.string.alpha({ length: { min: 5, max: 10 } }),
    image: faker.internet.url(),
    rating: Number(faker.number.octal({ min: 5, max: 54 })),
    title: faker.vehicle.model(),
  };
};
