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

    grunt aws-install
    
This installs the lambda function on AWS. This requires 'normal' AWS admin rights (or at least admin rights to AWS 
Lambda), i.e. run the script as an user that has the appropriate AWS accesskey (~/.aws/credentials) to install the 
lambda function. Also make sure the appropriate AWS region where to install the lambda function is configured 
(see ~/.aws/config).

### Deployment of script on system responsible for call-out to the lambda-function

    ansible-playbook -vv -i HOSTS_FILE [--ask-become-pass] dyndup.yml
    
        HOSTS_FILE: inventory file, listing hosts where to deploy. 
    
    Python must be installed on all of the hosts (is a prerequisite for Ansible). Furthermore SSH access to all hosts 
    must be defined, e.g. via ~/.ssh/config which contains configuration for each host. 

This installs the dyndup.sh script and schedules the script as a cron-job to run every hour.