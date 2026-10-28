import { generateUser, UserData } from "./user";

/** Form-encoded body expected by the createAccount / updateAccount endpoints. */
export function toApiPayload(user: UserData = generateUser()): Record<string, string> {
  return {
    name: user.name,
    email: user.email,
    password: user.password,
    title: user.title.replace(".", ""),
    birth_date: user.birthDay,
    birth_month: user.birthMonth,
    birth_year: user.birthYear,
    firstname: user.firstName,
    lastname: user.lastName,
    company: user.company,
    address1: user.address,
    address2: user.address2,
    country: user.country,
    zipcode: user.zipcode,
    state: user.state,
    city: user.city,
    mobile_number: user.phone,
  };
}
