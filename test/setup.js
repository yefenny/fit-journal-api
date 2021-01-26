process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-app';

require('dotenv').config();

process.env.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  'postgresql://yefenny@localhost/fit-journal-test';

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;
