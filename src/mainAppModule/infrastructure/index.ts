import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";

interface MainAppStackProps extends cdk.StackProps {
  usersTable: dynamodb.Table;
}

export class MainAppStack extends cdk.Stack {
  public readonly createCustomerFunction: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: MainAppStackProps) {
    super(scope, id, props);

    this.createCustomerFunction = this.createCreateCustomerFunction(
      props.usersTable
    );
  }

  private createCreateCustomerFunction(
    usersTable: dynamodb.Table
  ): lambdaNodejs.NodejsFunction {
    const createCustomerFunction = new lambdaNodejs.NodejsFunction(
      this,
      "CreateCustomerFunction",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        memorySize: 128,
        timeout: cdk.Duration.seconds(10),
        environment: {
          USERS_TABLE_NAME: usersTable.tableName,
        },
        entry:
          "src/mainAppModule/adapters/input/function/createCustomer/index.ts",
        handler: "handler",
      }
    );

    usersTable.grantReadWriteData(createCustomerFunction);

    return createCustomerFunction;
  }
}
