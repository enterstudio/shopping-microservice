/**
 * Created by mayujain on 5/1/17.
 */

import 'babel-polyfill'
process.env.NODE_ENV = 'test';
const httpStatus = require('http-status');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/server');
let should = chai.should();
let expect = chai.expect();
// let assert = chai.assert;
let assert = require('assert');
chai.use(require('chai-json-schema'));
chai.use(chaiHttp);
import schema from './schemas';

describe('Shopping-Microservice', () => {
    /*
     * Test the /GET route
     */
    describe('/GET ping', () => {
        it('it should return ' + httpStatus.OK, (done) => {
            chai.request(server)
                .get('/api/v1/shopping/ping')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').equal(true);
                    done();
                });
        });
    });

    describe('/GET webhook', () => {
        it('it should verify response with schema', (done) => {
            chai.request(server)
                .get('/api/v1/shopping/webhook')
                .end((err, res) => {
                    res.should.have.status(httpStatus.OK);
                    res.body.should.be.a('array');
                    res.body.should.be.jsonSchema(schema.webhookResponseSchema);
                    done();
                });
        });
    });

/*    describe('/GET stores?$expand=products,categories', () => {
        it('it should verify response with schema', (done) => {
            chai.request(server)
                .get('/api/v1/shopping/stores?$expand=products,categories')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.be.jsonSchema(schema.storesSchema);
                    done();
                });
        });
    });*/


});
