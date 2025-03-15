import { User } from "../../../../domain/entities/user";
import { ICustomerRepository } from "../../../../domain/repositories/customerRepository";
import {
  DynamoDBDocument,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserRole } from "../../../../domain/entities/enums/userRole";

export class CustomerData implements ICustomerRepository {
  private databaseClient: DynamoDBDocument;

  constructor() {
    this.databaseClient = DynamoDBDocument.from(new DynamoDBClient({}));
  }

  public async getByEmail(email: string): Promise<User | null> {
    const params = {
      TableName: process.env.USERS_TABLE_NAME,
      IndexName: "gsi-userEmail",
      KeyConditionExpression: "userEmail = :email AND sortingKey = :sortingKey",
      ExpressionAttributeValues: {
        ":email": email,
        ":sortingKey": EMPTY_DDB_ATTRIBUTE,
      },
    };

    const command = new QueryCommand(params);
    const response = await this.databaseClient.send(command);

    return (
      response.Items?.map((item) => this.ddbItemToEntity(item as DDBItem))[0] ??
      null
    );
  }

  public async create(entity: User): Promise<void> {
    const params = {
      TableName: process.env.USERS_TABLE_NAME,
      Item: this.entityToDDBItem(entity),
    };

    const command = new PutCommand(params);
    await this.databaseClient.send(command);
  }

  private ddbItemToEntity(item: DDBItem): User {
    return User.load(
      item.id,
      item.name,
      item.userEmail ?? "",
      item.role as UserRole,
      item.phone,
      item.address,
      new Date(item.createdAt),
      item.isDeleted,
      item.deletedAt ? new Date(item.deletedAt) : null
    );
  }

  private entityToDDBItem(entity: User): DDBItem {
    return {
      role: entity.role,
      id: entity.id,
      userEmail: entity.email,
      sortingKey: EMPTY_DDB_ATTRIBUTE,

      name: entity.name,
      phone: entity.phone,
      address: entity.address,
      createdAt: new Date().toISOString(),
      isDeleted: entity.isDeleted,
      deletedAt: entity.deletedAt?.toISOString() ?? EMPTY_DDB_ATTRIBUTE,
    };
  }
}

type DDBItem = {
  role: string;
  id: string;
  userEmail?: string;
  sortingKey?: string;

  name: string;
  phone: string;
  address: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string;
};

const EMPTY_DDB_ATTRIBUTE = "-";
