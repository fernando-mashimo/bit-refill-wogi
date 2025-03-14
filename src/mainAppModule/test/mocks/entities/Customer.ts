import { UserRole } from "../../../domain/entities/enums/userRole";
import { User } from "../../../domain/entities/user";

export const CustomerMock = (isDeleted = false): User => {
  return User.load(
    "52187cad-c8f8-4474-beed-706b9f98e2bf",
    "John Doe",
    "johnDoe@mail.com",
    UserRole.CUSTOMER,
    "+5511911112222",
    "Av. Paulista, 1000",
    new Date("2025-03-01"),
    isDeleted,
    isDeleted ? new Date("2025-03-02") : null
  );
};
