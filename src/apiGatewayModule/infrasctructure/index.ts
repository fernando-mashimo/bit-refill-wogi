import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cwLogs from "aws-cdk-lib/aws-logs";

interface ApiGatewayStackProps extends cdk.StackProps {
  createCustomerFunction: lambdaNodeJs.NodejsFunction;
}

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const mainAppApi = this.createApiGateway("MainAppApi");
    this.addCustomersResource(mainAppApi, props);
  }

  private createApiGateway(stackId: string): apigateway.RestApi {
    const apiLogGroup = new cwLogs.LogGroup(this, `${stackId}LogGroup`);
    const api = new apigateway.RestApi(this, stackId, {
      restApiName: stackId,
      description: `API Gateway for ${stackId}`,
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(
          apiLogGroup
        ),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          httpMethod: true,
          ip: true,
          protocol: true,
          requestTime: true,
          resourcePath: true,
          responseLength: true,
          status: true,
          caller: true,
          user: true,
        }),
      },
    });

    return api;
  }

  private addCustomersResource(
    api: apigateway.RestApi,
    props: ApiGatewayStackProps
  ): void {
    // Create Customer resource
    const createCustomerIntegration = new apigateway.LambdaIntegration(
      props.createCustomerFunction
    );
    const customersResource = api.root.addResource("customers");
    customersResource.addMethod("POST", createCustomerIntegration);
  }
}
