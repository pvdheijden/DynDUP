DynDUP
======

AWS lambda

    !# /bin/bash

    # create zip
    zip dyndup.zip dyndup.js lib/aws-route53-rrs.js

    # upload zip to aws lambda
    aws lambda upload-function \
    --function-name dyndup \
    --function-zip dyndup.zip \
    --role arn:aws:iam::402526837177:role/lambda-execution \
    --mode event \
    --handler dyndup.handler \
    --runtime nodejs