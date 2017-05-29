#!/usr/bin/env bash
set -e

#API_KEY= # Make available via environment variable
API_URL=https://9zoxbqmw3m.execute-api.eu-west-1.amazonaws.com/prod/DnsARecord
RECORD_DATA=record-data.json

curl -i -X POST $API_URL\
    --header "Content-Type: application/json"   \
    --header "x-api-key: $API_KEY"              \
    --data "@$RECORD_DATA"
