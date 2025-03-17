import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as cwLogs from "aws-cdk-lib/aws-logs";
// import * as route53 from "aws-cdk-lib/aws-route53";
// import * as acm from "aws-cdk-lib/aws-certificatemanager";
// import * as targets from "aws-cdk-lib/aws-route53-targets";
// import { $config } from "../../../lib/config";

interface ApiGatewayStackProps extends cdk.StackProps {
  createCustomerFunction: lambdaNodeJs.NodejsFunction;
}

export class ApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const mainAppApi = this.createApiGateway("MainAppApi");
    // this.addApiGatewayCustomDomain(mainAppApi, $config.STORE_API_GATEWAY_NAME); // custom domain set manually in the AWS Console and Cloudflare
    this.addCustomersResource(mainAppApi, props);
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

  private addCustomersResource(
    api: apiGateway.RestApi,
    props: ApiGatewayStackProps
  ): void {
    // create API root resource
    const apiRootResource = api.root.addResource("api");
    
    // Create Customer resource
    const createCustomerIntegration = new apiGateway.LambdaIntegration(
      props.createCustomerFunction
    );

    const customersResource = apiRootResource.addResource("customers");
    customersResource.addMethod("POST", createCustomerIntegration);
  }

  // private addApiGatewayCustomDomain(
  //   api: apiGateway.RestApi,
  //   subdomain: string
  // ): void {
  //   // Created a hosted zone manually in the AWS Console for domain mashimo.dev.br
  //   // so it just needs to be looked up
  //   // if not created manually, create it programatically with "new route53.HostedZone(this, `${api.restApiName}GatewayHostedZone`, { zoneName: $config.DOMAIN_NAME });"
  //   const hostedZone = route53.HostedZone.fromLookup(
  //     this,
  //     `${api.restApiName}GatewayHostedZone`,
  //     {
  //       domainName: $config.DOMAIN_NAME,
  //     }
  //   );

  //   const certificate = new acm.Certificate(
  //     this,
  //     `${api.restApiName}GatewayDomainCertificate`,
  //     {
  //       domainName: subdomain,
  //       validation: acm.CertificateValidation.fromDns(hostedZone),
  //     }
  //   );

  //   new cdk.CfnOutput(this, `${api.restApiName}GatewayCertificateArn`, {
  //     value: certificate.certificateArn,
  //   });

  //   api.addDomainName(`${api.restApiName}GatewayDomain`, {
  //     domainName: subdomain,
  //     certificate: certificate,
  //   });

    // Route 53 records are not required in this case, as DNS management is done in the domain registrar (Cloudflare)
    // new route53.CnameRecord(this, `${api.restApiName}GatewayAliasRecord`, {
    //   zone: hostedZone,
    //   recordName: subdomain,
    //   domainName: apiGatewayDomain.domainName,
    // });

    // new route53.ARecord(this, `${api.restApiName}GatewayAliasRecord`, {
    //   zone: hostedZone,
    //   recordName: subdomain,
    //   target: route53.RecordTarget.fromAlias(
    //     new targets.ApiGatewayDomain(apiGatewayDomain)
    //   ),
    // });
  // }
}
