var rrs = require('./lib/aws-route53-rrs');

exports.handler = function(event, context) {
    var hostedZoneId = event.zoneId;
    var recordName = event.recordName;
    var value = event.value;

    rrs.setA(hostedZoneId, recordName, value, function(err, data) {
        if (err) {
            return context.done(err);
        }

        context.done(null, data !== null ? 'resource record update' : 'resource record not updated');
    });
};
