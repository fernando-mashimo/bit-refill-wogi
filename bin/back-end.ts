#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { DatabaseStack } from "../src/databaseModule/infrastructure";
import { MainAppStack } from "../src/mainAppModule/infrastructure";
import { ApiGatewayStack } from "../src/apiGatewayModule/infrasctructure";

const app = new cdk.App();

const databaseStack = new DatabaseStack(app, "DatabaseStack", {
  tags: {
    module: "databaseModule",
  },
  description: "This stack creates the database resources for the application",
});

const mainAppStack = new MainAppStack(app, "MainAppStack", {
  tags: {
    module: "mainAppModule",
  },
  description: "This stack creates the main application resources",
  usersTable: databaseStack.usersTable,
});
mainAppStack.addDependency(databaseStack);

const apiGatewayStack = new ApiGatewayStack(app, "ApiGatewayStack", {
  tags: {
    module: "apiGatewayModule",
  },
  description: "This stack creates the API Gateway resources",
  createCustomerFunction: mainAppStack.createCustomerFunction,
});
apiGatewayStack.addDependency(mainAppStack);
