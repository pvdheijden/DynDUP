'use strict';

const AWS = require('aws-sdk');
const route53 = new AWS.Route53();

const getA = function(hostedZoneId, recordName, callback) {
    console.info('getA call for: %s/%s', hostedZoneId, recordName);

    const params = {
        'HostedZoneId': hostedZoneId,
        'StartRecordType': 'A',
        'StartRecordName': recordName,
        'MaxItems': '1'
    };

    route53.listResourceRecordSets(params, function(err, data) {
        if (err) {
            console.error('list rrs failure "%j"', err);
            return callback(err);
        }

        console.info('list rrs "%j"', data);
        if (data.ResourceRecordSets.length) {
            callback(null, data.ResourceRecordSets[0]);
        } else {
            callback(null, null);
        }
    });
};

const setA = function(hostedZoneId, recordName, value, callback) {
    console.info('setA call for: %s/%s --> value: %s', hostedZoneId, recordName, value);

    getA(hostedZoneId, recordName, function(err, data) {
        if (err) {
            return callback(err);
        }

        let isSet = (data !== null);
        if (isSet) {
            isSet = false;
            data.ResourceRecords.forEach(function(rr) {
                if (rr.Value === value) {
                    isSet = true;
                }
            });

            console.info('value %s set', isSet ? 'already' : 'not');
        }

        if (!isSet) {
            const params = {
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
                    console.error('change rrs failure "%j"', err);
                    return callback(err);
                }

                console.info('change rrs "%j"', data);
                callback(err, data);
            });
        } else {
            callback(null, null);
        }
    });
};

module.exports.getA = getA;
module.exports.setA = setA;
