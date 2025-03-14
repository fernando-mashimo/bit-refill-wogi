import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cwLogs from "aws-cdk-lib/aws-logs";

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = this.createApiGateway('MainAppApi');
  }

  private createApiGateway(stackId: string): apigateway.RestApi {
    const api = new apigateway.RestApi(this, stackId, {
      restApiName: stackId,
    });

    return api;
  }
}
