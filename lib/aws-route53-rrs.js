'use strict';

var debug;
if (process.env.DEBUG) {
    debug = require('debug')('dyndup:aws-route53-rrs');
} else {
    debug = function() {};
}

var AWS = require('aws-sdk');
var route53 = new AWS.Route53();

var getA = function(hostedZoneId, recordName, callback) {
    debug('getA call for: %s/%s', hostedZoneId, recordName);

    var params = {
        'HostedZoneId': hostedZoneId,
        'StartRecordType': 'A',
        'StartRecordName': recordName,
        'MaxItems': '1'
    };

    route53.listResourceRecordSets(params, function(err, data) {
        if (err) {
            debug('list rrs failure "%j"', err);
            return callback(err);
        }

        debug('list rrs "%j"', data);
        if (data.ResourceRecordSets.length) {
            callback(null, data.ResourceRecordSets[0]);
        } else {
            callback(null, null);
        }
    });
};

var setA = function(hostedZoneId, recordName, value, callback) {
    debug('setA call for: %s/%s --> value: %s', hostedZoneId, recordName, value);

    getA(hostedZoneId, recordName, function(err, data) {
        if (err) {
            return callback(err);
        }

        var isSet = (data !== null);
        if (isSet) {
            isSet = false;
            data.ResourceRecords.forEach(function(rr) {
                if (rr.Value === value) {
                    isSet = true;
                }
            });

            debug('value %s set', isSet ? 'already' : 'not');
        }

        if (!isSet) {
            var params = {
                'ChangeBatch': {
                    'Changes': [{
                        'Action': 'UPSERT',
                        'ResourceRecordSet': {
                            'Name': recordName,
                            'Type': 'A',
                            'ResourceRecords': [ { 'Value': value }],
                            'TTL': 300
                        }
                    }]
                },
                HostedZoneId: hostedZoneId
            };

            route53.changeResourceRecordSets(params, function(err, data) {
                if (err) {
                    debug('change rrs failure "%j"', err);
                    return callback(err);
                }

                debug('change rrs "%j"', data);
                callback(err, data);
            });
        } else {
            callback(null, null);
        }
    });
};

module.exports.getA = getA;
module.exports.setA = setA;
