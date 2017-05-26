#!/usr/bin/env bash
set -e

API_URL=https://9zoxbqmw3m.execute-api.eu-west-1.amazonaws.com/prod/DnsARecord
API_KEY={{api_key}}

curl -i -X POST $API_URL\
    --header "Content-Type: application/json"   \
    --header "x-api-key: $API_KEY"              \
    --data "@record-data.json"
