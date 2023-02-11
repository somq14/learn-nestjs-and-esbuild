import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

export type AppStackProps = cdk.StackProps & {
  root: string;
};

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const handlerFunction = new lambda.Function(this, 'HandlerFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(path.resolve(props.root, 'dist/api')),
      handler: 'index.handler',
      memorySize: 1769,
      timeout: cdk.Duration.seconds(30),
      environment: {
        NO_COLOR: 'true',
      },
    });

    const api = new apigateway.RestApi(this, 'Api', {
      defaultIntegration: new apigateway.LambdaIntegration(handlerFunction, {}),
      deployOptions: {
        stageName: 'v1',
      },
    });
    api.root.addMethod('ANY');
    api.root.addProxy();
  }
}
