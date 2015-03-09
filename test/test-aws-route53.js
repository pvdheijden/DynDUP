/*jshint -W030 */

'use strict';
var expect = require('chai').expect;

var zoneId = 'Z3M4FTU3CAMMOE';
var rrs = require('../lib/aws-route53-rrs');

describe('functions', function() {

    it('rrs.getA should be a function', function() {
        expect(rrs.getA).to.be.a('function');
    });

});

describe('aws-route53-rss functions', function() {

    it('getA', function(done) {
        this.timeout(0);
        rrs.getA(zoneId, 'denbosch.zifzaf.com.', function(err, data) {
            if (err) {
                return done(err);
            }

            console.dir(data, { 'depth': null });
            done();
        });
    });

    it('setA', function(done) {
        this.timeout(0);
        rrs.setA(zoneId, 'denbosch.zifzaf.com.', '84.27.225.222', function(err, data) {
            if (err) {
                return done(err);
            }

            console.dir(data, { 'depth': null });
            done();
        });
    });

});

/*jshint +W030 */
