/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  var _id;
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.property(res.body, 'issue_title');
           assert.property(res.body, 'issue_text');
           assert.property(res.body, 'created_by');
           assert.property(res.body, 'assigned_to');
           assert.property(res.body, 'status_text');
           assert.property(res.body, 'created_on');
           assert.property(res.body, 'updated_on');
           assert.property(res.body, 'open');
           assert.property(res.body, '_id');
           _id = res.body._id;
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.equal(res.body.open, true);
         // assert.beforeTime(res.body.created_on, new Date());
          //fill me in too!
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Every field filled in'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Title');
            assert.equal(res.body.issue_text, 'text');
            assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
            assert.equal(res.body.open, true);
           // assert.beforeTime(res.body.created_on, new Date());
            //fill me in too!

            done();
          });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'required field empty');
           // assert.beforeTime(res.body.created_on, new Date());
            //fill me in too!

            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({_id: _id })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no updated field sent');
          
          done();
        });
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({_id: _id, issue_text: 'edited text'})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated' || 'could not update '+_id);
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: _id,
          issue_title:  'edited title',
          created_by:   'edited created'})
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated' || 'could not update '+_id);
          
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          _id: _id
        })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          res.body.forEach( issue => assert.equal(issue._id, _id) );
          
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          res.body.forEach( issue => {
            assert.equal(issue.assigned_to, 'Chai and Mocha');
            assert.equal(issue.status_text, 'In QA');            
          });
          done();
        });
          
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, '_id error');
          
          done();
        });
        
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: _id})
        .end( (err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'deleted '+_id || 'could not delete '+_id);
          
          done();
        });
      });
      
    });

});
