'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const User = require('../model/user');
const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;
const exampleUser = {
  username: 'wazzup',
  password: '1234',
  email: 'slug@slug.com',
}

describe('testing auth-router', function() {
  describe('testing POST /api/signup', function() {
    describe('with valid body', function() {
      after( done => {
        User.remove({})
        .then(() => done())
        .catch(done)
      })

      it('should return a token', (done) => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(!!res.text).to.equal(true);

          done();
        })
      })
    })
  })
  describe('testing GET /api/signup', function() {
    describe('with valid body', function() {
      before ( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          done();
        })
        .catch(done)
      })
      after( done => {
        User.remove({})
        .then(() => done())
        .catch(done)
      })

      it('should return a token', (done) => {
        request.get(`${url}/api/login`)
        .auth('wazzup', '1234')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(!!res.text).to.equal(true);

          done();
        })
      })
    })
  })
})
