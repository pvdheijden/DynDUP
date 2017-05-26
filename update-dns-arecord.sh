#!/usr/bin/env bash
set -e

API_URL=https://9zoxbqmw3m.execute-api.eu-west-1.amazonaws.com/prod/DnsARecord
API_KEY=9AIoM6ypFE3USfbt167Yq9VEMMty4Qmq1Crq7Jnc

curl -i -X POST $API_URL\
    --header "Content-Type: application/json"   \
    --header "x-api-key: $API_KEY"              \
    --data "@record-data.json"
