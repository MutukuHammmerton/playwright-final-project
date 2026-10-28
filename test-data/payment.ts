import { faker } from "@faker-js/faker";

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export function generatePayment(): PaymentData {
  return {
    nameOnCard: faker.person.fullName(),
    cardNumber: faker.finance.creditCardNumber({ issuer: "visa" }).replace(/\D/g, ""),
    cvc: faker.finance.creditCardCVV(),
    expiryMonth: String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0"),
    expiryYear: String(new Date().getFullYear() + faker.number.int({ min: 1, max: 5 })),
  };
}
