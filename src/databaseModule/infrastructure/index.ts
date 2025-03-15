import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class DatabaseStack extends cdk.Stack {
  public readonly usersTable: dynamodb.Table;
  public readonly productsTable: dynamodb.Table;
  public readonly ordersTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.usersTable = this.createUsersTable();
    this.productsTable = this.createProductsTable();
    this.ordersTable = this.createOrdersTable();
  }

  private createUsersTable(): dynamodb.Table {
    const usersTable = new dynamodb.Table(this, "UsersTable", {
      tableName: "Users",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: "role",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    usersTable.addGlobalSecondaryIndex({
      indexName: "gsi-userEmail",
      partitionKey: {
        name: "userEmail",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sortingKey",
        type: dynamodb.AttributeType.STRING,
      },
    });


    return usersTable;
  }

  private createProductsTable(): dynamodb.Table {
    const productsTable = new dynamodb.Table(this, "ProductsTable", {
      tableName: "Products",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    productsTable.addGlobalSecondaryIndex({
      indexName: "gsi-category",
      partitionKey: {
        name: "category",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sortingKey",
        type: dynamodb.AttributeType.STRING,
      },
    });    

    productsTable.addGlobalSecondaryIndex({
      indexName: "gsi-id",
      partitionKey: {
        name: "productId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sortingKey",
        type: dynamodb.AttributeType.STRING,
      },
    });

    return productsTable;
  }

  private createOrdersTable(): dynamodb.Table {
    const ordersTable = new dynamodb.Table(this, "OrdersTable", {
      tableName: "Orders",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    ordersTable.addGlobalSecondaryIndex({
      indexName: "gsi-customerId",
      partitionKey: {
        name: "customerId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sortingKey",
        type: dynamodb.AttributeType.STRING,
      },
    });

    ordersTable.addGlobalSecondaryIndex({
      indexName: "gsi-id",
      partitionKey: {
        name: "orderId",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sortingKey",
        type: dynamodb.AttributeType.STRING,
      },
    });

    return ordersTable;
  }
}
