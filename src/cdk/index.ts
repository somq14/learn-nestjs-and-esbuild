import * as cdk from 'aws-cdk-lib';
import path from 'path';
import { AppStack } from './app-stack';

const app = new cdk.App();

new AppStack(app, 'learn-nestjs-and-esbuild', {
  root: path.resolve(__dirname, '../..'),
});
