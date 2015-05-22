# DynDUP

dyndup.sh is a bash script that:

* Get external dynamic IP-address as provided by ISP (via http://www.telize.com/ip)
* Calls into AWS lambda function that updates entry (A-record) in AWS Route53 if needed

Repository contains:

* dyndup (bash-) script
* AWS lambda function
* Scripting (Gruntfile.js) to install the lambda function on AWS 
* Ansible script to setup and configure the dyndup.sh script as a cron-job to update at a regular 
interval the DNS entry

## Installation

### Installation prerequisites

* [Node.js and NPM](https://nodejs.org) installed and setup
* [Grunt CLI](http://gruntjs.com/getting-started) installed
* [AWS Command Line Interface](http://aws.amazon.com/cli/) tooling and setup of AWS credentials
* [Ansible](http://docs.ansible.com/index.html) installed and setup


### Installation of AWS lambda function

    grunt lambda-install
    
This installs the lambda function on AWS. This requires 'normal' AWS admin rights (or at least admin rights to AWS 
Lambda), i.e. run the script as an user that has the appropriate AWS accesskey (~/.aws/credentials) to install the 
lambda function. Also make sure the appropriate AWS region where to install the lambda function is configured 
(see ~/.aws/config).

### AWS permissions

#### dyndup aws-user policy

The dyndup.sh script needs the nessecary rights and permissions to execute the lambda function. This is accomplished 
by running the script in the context of an user (i.e. user: dyndup) on the host with the AWS credentials (i.e. 
aws-user: dyndup) with the (minimal) required permissions. 

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "iam:PassRole",
                    "lambda:*"
                ],
                "Resource": "*"
            }
        ]
    }
    
#### dyndup lambda execution policy

The lambda function itself must have the nessecary rigths, assigned the AWS-role (i.e. dyndup-execution) to read 
and write the Route53 DNS records.

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": [
                    "logs:*"
                ],
                "Effect": "Allow",
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "route53:*"
                ],
                "Resource": [
                    "arn:aws:route53:::hostedzone/HOST_ID"
                ]
            }
        ]
    }

### Deployment of DynDUP script 

    grunt client-install. 
    
    Python must be installed on all of the hosts where dyndup client will be installed (is a prerequisite for Ansible). 
    Furthermore SSH access to all hosts must be defined, e.g. via ~/.ssh/config which contains configuration 
    for each host. 

This installs (using Ansible) the dyndup.sh script and schedules the script as a cron-job to run every hour for a 
call-out to the lambda-function to update the DNS record if needed.

Note that the script uses the hostname of the host executing the script, at the time of the setup, as the hostname 
to be used for the DNS record.

TODO: This needs to be done by AWS admin, need to check if this can be automated via the ansible script
