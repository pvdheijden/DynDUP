var rrs = require('./lib/aws-route53-rrs');

exports.handler = function(event, context) {
    const zoneId = event.zoneId;
    const aRecord = event.aRecord;
    const value = event.ip;

    rrs.setA(zoneId, aRecord, value, function(err, data) {
        if (err) {
            return context.done(err);
        }

        context.done(null, data !== null ? 'resource record update' : 'resource record not updated');
    });
};
