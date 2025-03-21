import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class BitrefillAppStack extends cdk.Stack {
  public readonly createCustomerFunction: lambdaNodejs.NodejsFunction;
  public readonly getWogiProductsFunction: lambdaNodejs.NodejsFunction;
  public readonly getWogiProductLinesFunction: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.getWogiProductsFunction = this.createGetWogiProductsFunction();

    this.getWogiProductLinesFunction = this.createGetWogiProductLinesFunction();
  }

  private createGetWogiProductsFunction(): lambdaNodejs.NodejsFunction {
    const getWogiProductsFunction = new lambdaNodejs.NodejsFunction(
      this,
      "GetWogiProductsFunctionV2",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        memorySize: 128,
        timeout: cdk.Duration.seconds(10),
        entry:
          "src/bitrefillAppModule/adapters/input/function/getWogiProducts/index.ts",
        handler: "handler",
      }
    );

    return getWogiProductsFunction;
  }

  private createGetWogiProductLinesFunction(): lambdaNodejs.NodejsFunction {
    const getWogiProductLinesFunction = new lambdaNodejs.NodejsFunction(
      this,
      "GetWogiProductLinesFunctionV2",
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        memorySize: 128,
        timeout: cdk.Duration.seconds(10),
        entry:
          "src/bitrefillAppModule/adapters/input/function/getWogiProductLines/index.ts",
        handler: "handler",
      }
    );

    return getWogiProductLinesFunction;
  }
}
