import { faker } from "@faker-js/faker";

export interface UserData {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  title: "Mr." | "Mrs.";
  company: string;
  address: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
}

export function generateUser(): UserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email: `${faker.internet.username({ firstName, lastName }).toLowerCase()}${Date.now()}@example.com`.replace(/[^a-z0-9@._+-]/g, ""),
    phone: `07${faker.string.numeric(8)}`,
    password: faker.internet.password({ length: 12 }),
    title: faker.helpers.arrayElement(["Mr.", "Mrs."] as const),
    company: faker.company.name(),
    address: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: "United States",
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode("#####"),
    birthDay: String(faker.number.int({ min: 1, max: 28 })),
    birthMonth: String(faker.number.int({ min: 1, max: 12 })),
    birthYear: String(faker.number.int({ min: 1960, max: 2005 })),
  };
}
