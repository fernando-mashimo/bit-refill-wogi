import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as cwLogs from "aws-cdk-lib/aws-logs";

interface BitrefillApiGatewayStackProps extends cdk.StackProps {
  getWogiProductsFunction: lambdaNodeJs.NodejsFunction;
  getWogiProductLinesFunction: lambdaNodeJs.NodejsFunction;
}

export class BitrefillApiGatewayStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: BitrefillApiGatewayStackProps
  ) {
    super(scope, id, props);

    const bitrefillAppApi = this.createApiGateway("BitrefillAppApi");
    this.addResources(bitrefillAppApi, props);
  }

  private createApiGateway(stackId: string): apiGateway.RestApi {
    const apiLogGroup = new cwLogs.LogGroup(this, `${stackId}LogGroup`);
    const api = new apiGateway.RestApi(this, stackId, {
      restApiName: stackId,
      description: `API Gateway for ${stackId}`,
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apiGateway.LogGroupLogDestination(
          apiLogGroup
        ),
        accessLogFormat: apiGateway.AccessLogFormat.jsonWithStandardFields({
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
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS,
        allowMethods: apiGateway.Cors.ALL_METHODS,
        allowHeaders: apiGateway.Cors.DEFAULT_HEADERS,
      },
    });

    const usagePlan = api.addUsagePlan(`${stackId}UsagePlan`, {
      name: `${stackId}UsagePlan`,
      throttle: {
        rateLimit: 5, // requests per second
        burstLimit: 10,
      },
      quota: {
        limit: 1000, // requests per day
        period: apiGateway.Period.DAY,
      },
    });
    usagePlan.addApiStage({
      stage: api.deploymentStage,
    });

    return api;
  }

  private addResources(
    api: apiGateway.RestApi,
    props: BitrefillApiGatewayStackProps
  ): void {
    // create API root resource
    const apiRootResource = api.root.addResource("api");

    // Adds Get Wogi Products resource
    const getWogiProductsIntegration = new apiGateway.LambdaIntegration(
      props.getWogiProductsFunction
    );

    const wogiResource = apiRootResource.addResource("wogi");
    wogiResource
      .addResource("products")
      .addMethod("GET", getWogiProductsIntegration);

    // Adds Get Wogi Product Lines resource
    const getWogiProductLinesIntegration = new apiGateway.LambdaIntegration(
      props.getWogiProductLinesFunction
    );

    wogiResource
      .addResource("product-lines")
      .addMethod("GET", getWogiProductLinesIntegration);
  }
}
