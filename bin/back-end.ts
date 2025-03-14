#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../src/databaseModule/infrastructure';
import { MainAppStack } from '../src/mainAppModule/infrastructure';

const app = new cdk.App();

const databaseStack = new DatabaseStack(app, 'DatabaseStack', {
  tags: {
    module: 'databaseModule'
  },
  description: 'This stack creates the database resources for the application'
});

const mainAppStack = new MainAppStack(app, 'MainAppStack', {
  tags: {
    module: 'mainAppModule'
  },
  description: 'This stack creates the main application resources for the application',
  usersTable: databaseStack.usersTable,
});
mainAppStack.addDependency(databaseStack);
