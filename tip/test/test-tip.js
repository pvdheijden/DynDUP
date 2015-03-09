/*jshint -W030 */

'use strict';
/*
var expect = require('chai').expect;

var soap = require('soap');
var url = 'https://api.transip.nl/wsdl/?service=DomainService';

var SecurityModule = require('../lib/security/tip-auth-security');
var Security = new SecurityModule('pim1967', './dyndup.pem');

describe('constructor function', function() {

    it('Security should be a function', function() {
        expect(Security).to.be.a('function');
    });

});

describe('DomainService functions', function() {

    it('getInfo', function(done) {

        soap.createClient(url, function(err, client) {
            var args = {
                'domainName': 'zifzaf.com'
            };

            client.setSecurity(new Security('DomainService', 'getInfo', args));
            client.getInfo(args, function(err, result) {
                console.log(result.body);

                done(err);
            });
        });

    });

});
*/


/*jshint +W030 */
