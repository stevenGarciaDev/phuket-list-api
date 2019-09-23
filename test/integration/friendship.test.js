const request = require('supertest');
const { Friend } = require('../../models/friend');
const mongoose = require('mongoose');
let server;

describe('api/data', () => {
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(() => {
    server.close();
  });

  describe('GET /', () => {
    // beforeEach(() => {
    //
    // });
    //
    // afterEach(() => {
    //
    // });


    it('', async () => {

    });

  });
});
