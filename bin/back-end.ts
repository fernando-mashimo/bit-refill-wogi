#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { BitrefillAppStack } from "../src/bitrefillAppModule/infrastructure";
import { BitrefillApiGatewayStack } from "../src/bitrefillApiGatewayModule/infrasctructure";
import { $config } from "../lib/config";

const app = new cdk.App();
const env: cdk.Environment = {
  account: $config.AWS_ACCOUNT_ID,
  region: $config.AWS_REGION,
};

const bitrefillAppStack = new BitrefillAppStack(app, "BitrefillAppStack", {
  env,
  tags: {
    module: "bitrefillAppModule",
  },
  description: "This stack creates the main application resources",
});

const bilrefillApiGatewayStack = new BitrefillApiGatewayStack(
  app,
  "BitrefillApiGatewayStack",
  {
    env,
    tags: {
      module: "bitrefillApiGatewayModule",
    },
    description: "This stack creates the API Gateway resources",
    getWogiProductsFunction: bitrefillAppStack.getWogiProductsFunction,
  }
);
bilrefillApiGatewayStack.addDependency(bitrefillAppStack);
