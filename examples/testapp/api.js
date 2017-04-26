'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('swagger-stats-example');
var express = require('express');
var apirouter = express.Router();


/**
 * @swagger
 * parameters:
 *  reusableparam:
 *    name: reusableparam
 *    in: query
 *    description: test reusable parameter
 *    required: true
 *    type: integer
 *    format: int64
 * definitions:
 *  pet:
 *    type: object
 *    required:
 *      - id
 *      - name
 *    properties:
 *      id:
 *        type: integer
 *        format: int64
 *      name:
 *        type: string
 *      tag:
 *        type: string
 *  newPet:
 *    type: object
 *    required:
 *      - name
 *    properties:
 *      id:
 *        type: integer
 *        format: int64
 *      name:
 *        type: string
 *      tag:
 *        type: string
 *  errorModel:
 *    type: object
 *    required:
 *      - code
 *      - message
 *    properties:
 *      code:
 *        type: integer
 *        format: int32
 *      message:
 *        type: string
 */


/**
 * @swagger
 *  /pets:
 *    get:
 *      description: Returns all pets from the system that the user has access to
 *      operationId: findPets
 *      produces:
 *        - application/json
 *        - application/xml
 *        - text/xml
 *        - text/html
 *      parameters:
 *        - name: tags
 *          in: query
 *          description: tags to filter by
 *          required: false
 *          type: array
 *          items:
 *            type: string
 *          collectionFormat: csv
 *        - name: limit
 *          in: query
 *          description: maximum number of results to return
 *          required: false
 *          type: integer
 *          format: int32
 *      responses:
 *        '200':
 *          description: pet response
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/definitions/pet'
 *        default:
 *          description: unexpected error
 *          schema:
 *            $ref: '#/definitions/errorModel'
 */
apirouter.get('/pets', function (req, res) {
    console.log('API:/pets');
    res.status(500).json({code:500,message:'Not implemented'});
});



// API for tests ///////////////////////////////////////// //

/**
 * @swagger
 * /success:
 *   get:
 *     description: Test success response
 *     produces:
 *       - text/html; charset=utf-8
 *     responses:
 *       200:
 *         description: Success Response
 */
apirouter.get('/success', function (req, res) {
    res.status(200).send('OK');
});

/**
 * @swagger
 * /redirect:
 *   get:
 *     description: Test redirect response
 *     responses:
 *       302:
 *         description: Redirect Response
 */
apirouter.get('/redirect', function (req, res) {
    res.redirect('/api/v1/success');
});

/**
 * @swagger
 * /client_error:
 *   get:
 *     description: Test Client Error Response
 *     produces:
 *       - text/html; charset=utf-8
 *     responses:
 *       404:
 *         description: Not Found Response
 */
apirouter.get('/client_error', function (req, res) {
    res.status(404).send('Not found');
});

/**
 * @swagger
 * /server_error:
 *   get:
 *     description: Test Server Error Response
 *     produces:
 *       - text/html; charset=utf-8
 *     responses:
 *       500:
 *         description: Server Error Response
 */
apirouter.get('/server_error', function (req, res) {
    res.status(500).send('Server Error');
});


/**
 * @swagger
 * /tester/{code}:
 *   get:
 *     operationId: getTesterApi
 *     summary: Test API Get opeation
 *     description: Test Swagger API path with GET operation, producing response supplied in request parameter
 *     tags:
 *       - tester
 *       - GET
 *     produces:
 *       - application/json
 *     responses:
 *        default:
 *          description: Response Message
 *          schema:
 *            $ref: '#/definitions/errorModel'
 *   post:
 *     operationId: postTesterApi
 *     summary: Test API POST operation
 *     description: Test Swagger API path with POST operation, producing response supplied in request parameter
 *     tags:
 *       - tester
 *       - POST
 *     produces:
 *       - application/json
 *     responses:
 *        default:
 *          description: Response Message
 *          schema:
 *            $ref: '#/definitions/errorModel'
 *   put:
 *     description: Test PUT method and various responses
 *     produces:
 *       - application/json
 *     responses:
 *        default:
 *          description: Response Message
 *          schema:
 *            $ref: '#/definitions/errorModel'
 *   delete:
 *     description: Test DELETE method and various responses
 *     deprecated: true
 *     produces:
 *       - application/json
 *     responses:
 *        default:
 *          description: Response Message
 *          schema:
 *            $ref: '#/definitions/errorModel'
 *     parameters:
 *         - $ref: '#/parameters/reusableparam'
 *   parameters:
 *     - name: code
 *       in: path
 *       description: response code to return
 *       required: true
 *       type: integer
 *       format: int64
 *     - name: delay
 *       in: query
 *       description: delay to wait before responding
 *       required: false
 *       type: integer
 *       format: int64
 *     - name: message
 *       in: query
 *       description: message to return
 *       required: true
 *       type: string
 */
apirouter.get('/tester/:code', testerImpl );
apirouter.post('/tester/:code', testerImpl );
apirouter.put('/tester/:code', testerImpl );
apirouter.delete('/tester/:code', testerImpl );

// Test API that is not defined in swagger spec
apirouter.get('/noswagger/:code', testerImpl );
apirouter.post('/noswagger/:code', testerImpl );
apirouter.put('/noswagger/:code', testerImpl );
apirouter.delete('/noswagger/:code', testerImpl );

function testerImpl(req, res) {
    var code = 500;
    var message = "ERROR: Wrong parameters";
    if(('params' in req) && 'code' in req.params ){
        code = parseInt(req.params.code);
        message = "Request Method:" + req.method +', params.code: ' + req.params.code;
    }

    if(('query' in req) && ('delay' in req.query)){
        var delay = parseInt(req.query.delay);
        setTimeout(function(){
            res.status(code).json({code: code, message: message});
        },delay);
    }else {
        res.status(code).json({code: code, message: message});
    }
}

module.exports = apirouter;