'use strict';

var debug = require('debug')('dyndup:tip-auth-security');
var assert = require('chai').assert;

var util = require('util');
var fs = require('fs');
var _ = require('lodash');

var TRANS_IP = {
    'API_HOST': 'api.transip.nl',
    'API_VERSION': '5.1'
};

function TransIPAuthSecurity(login, keyPath) {
    login = login || process.env.USERNAME;
    var key = fs.readFileSync(keyPath || process.env.KEYPATH);

    assert.isString(login, 'tip login');
    assert.isString(keyPath, 'private key -ath');

    debug('api endpoint "%s"', TRANS_IP.API_HOST);
    debug('api version "%s"', TRANS_IP.API_VERSION);
    debug('api login "%s"', login);
    debug('api key-path "%s"', keyPath);

    var sign = function(data) {
        debug('data to sign "%s"', data);

        var crypto = require('crypto');

        var hash = crypto.createHash('sha512').update(data).digest();
        debug('hash "%j"', hash);

        var asnHeader = new Buffer([
            0x30, 0x51,
            0x30, 0x0d,
            0x06, 0x09,
            0x60, 0x86, 0x48, 0x01, 0x65,
            0x03, 0x04,
            0x02, 0x03,
            0x05, 0x00,
            0x04, 0x40]);
        debug('asn-header "%j"', asnHeader);

        var digest = Buffer.concat([ asnHeader, hash ]);
        debug('digest "%j"', digest);

        var sign = crypto.createSign('RSA-SHA512');
        sign.update(digest);
        return sign.sign(key, 'base64');
    };

    return function(service, method, args, defaults) {
        defaults = defaults || {};
        assert.isString(service, 'api service name');
        assert.isString(method, 'service method');
        assert.isObject(args, 'method arguments');
        assert.isObject(defaults, 'defaults');

        var timestamp = Math.round(Date.now() / 1000);
        var nonce = require('node-uuid').v4().replace(/-/g, '');

        /*
        var args_string = '';
        for (var key in args) {
            if (args.hasOwnProperty(key)) {
                args_string += util.format('&%s=%s', key,  encodeURIComponent(args[key]));
            }
        }
        args = args_string.slice(1);
        */
        args = Object.keys(args).reduce(function(value, key) {
            return util.format('%s&%s=%s', value, key, args[key]);
        }, '').slice(1);
        debug('method arguments "%s"', args);

        this.cookies = [];
        this.cookies.push(util.format('login=%s', login));
        this.cookies.push('mode=readwrite');
        this.cookies.push(util.format('clientVersion=%s', TRANS_IP.API_VERSION));
        this.cookies.push(util.format('timestamp=%d', timestamp));
        this.cookies.push(util.format('nonce=%s', nonce));
        var signature = sign(new Buffer(util.format('%s&__method=%s&__service=%s&__hostname=%s&__timestamp=%d&__nonce=%s',
            args, method, service, TRANS_IP.API_HOST, timestamp, nonce
        )));
        this.cookies.push(util.format('signature=%s', encodeURIComponent(signature)));

        debug('authorization related cookies "%j"', this.cookies);

        this.defaults = {};
        _.merge(this.defaults, defaults);

        this.addHeaders = function(headers) {
            headers.Cookie = this.cookies.join('; ');
        };

        this.toXML = function() {
            return '';
        };

        this.addOptions = function(options) {
            _.merge(options, this.defaults);
        };
    };

}

module.exports = TransIPAuthSecurity;
