DynDUP
======

dyndup.sh is a bash script that:
- Get external dynamic IP-address as provided by ISP (via http://www.telize.com/ip)
- Calls into AWS lambda function that updates entry (A-record) in AWS Route53 if needed

Repository contains:
- dyndup (bash-) script
- AWS lambda function
- Ansible script to setup and configure script as a cron-job to update at a regular interval the DNS entry

Installation
------------
Installation of AWS lambda function

    npm run-script install-lambda

Deployment of script on system responsible for call-out to the lambda-function

    npm run-script deploy-clients

