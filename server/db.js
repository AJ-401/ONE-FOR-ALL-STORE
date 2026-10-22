// Database connection utilities for RDS MySQL and DynamoDB
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// ─── RDS MySQL Connection Pool ──────────────────────────────────────────────
const pool = mysql.createPool({
  host: process.env.RDS_HOST,
  port: parseInt(process.env.RDS_PORT, 10) || 3306,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ─── DynamoDB Document Client ───────────────────────────────────────────────
const dynamoClient = new DynamoDBClient({
  region: process.env.DYNAMO_REGION || process.env.AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true },
});

const DYNAMO_TABLE = process.env.DYNAMO_TABLE || 'ShoppingCart';

module.exports = { pool, dynamoDocClient, DYNAMO_TABLE };
