#!/usr/bin/env bash

set -e

ARGS_FILE=/tmp/dyndup.args

IP=$(curl -s http://www.telize.com/ip)
sed "s/IP/$IP/g" dyndup.event > $ARGS_FILE
aws lambda invoke-async --function-name dyndup --invoke-args $ARGS_FILE