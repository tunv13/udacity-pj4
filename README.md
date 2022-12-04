# Overview
Deploy a simple "TODO" application using AWS Lambda and Serverless framework. This application will allow users to create/remove/update/get TODO items
# Prerequisites
  - GitHub
  - Auth0 account : https://manage.auth0.com/
  - NodeJS v12.14 or greater up to v14.15 : https://nodejs.org/en/download/
  - AWS CLI v2 : https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html
  - Serverless Account : https://dashboard.serverless.com/

# Instructions
## Login aws console -> create IAM user -> choose User -> choose tab "security_credentials" -> create access key "<br/>
![screen shot](images/iam.png)<br/>
![screen shot](images/iam2.png)<br/>
![screen shot](images/iam3.png)<br/>

## Check and config aws

**1.Check aws cli working**<br/>
- Type : aws --version<br/>
![screen shot](images/aws.png)<br/>

## Install the Serverless Framework’s CLI and login

**1.Install Serverless**<br/>
- Type command : npm install -g serverless@2.21.1
- Check install : serverless --version <br/>
![screen shot](images/serverless1.png)<br/>

**2.Login and configure serverless to use the AWS credentials**<br/>
- Login to your dashboard from the CLI. It will ask to open your browser and finish the process.<br/>
- Type : serverless login<br/>
![screen shot](images/serverless2.png)<br/>

- Config serverless use AWS credentials<br/>
- Type : sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile NAME_PROFILE_YOUWANT<br/>
![screen shot](images/serverless3.png)<br/>

- Type : cat ~/.aws/credentials <br/>
- Success if you see "serverless" like this <br/>
![screen shot](images/configaws2.png)<br/>

## Setup Backend server

**1. Clone project from github**<br/>
**2. Move to folder backend**<br/>
**3. Run command : npm install**<br/>
**4. create an app on https://dashboard.serverless.com (just create it for the first time) - it should be the same as the app name in the serverless.yml config file**<br/>
- You need change "org" in file serverless.yml by name account you created in Serverless dashboard<br/>
- Change name "app" in file serverless.yml you want</br>
![screen shot](images/yml.png)<br/>
- Type command : serverless<br/>
- follow step by step request - Select "Create 'NAME_APP' app in 'NAME_ACCOUNT' org" : <br/>
![screen shot](images/serverless4.png)<br/>
- Create success and go to https://dashboard.serverless.com/ for check app created <br/>
![screen shot](images/serverless5.png)<br/>
![screen shot](images/serverless6.png)<br/>
**5. Deploy server**<br/>
- Type : serverless deploy --verbose<br/>
- wait for the server to deploy<br/>
![screen shot](images/deploy.png)<br/>
**6. Go to AWS console -> CloudFormation**
- if you see this "UPDATE_COMPLETE", the deployment is done<br/>
![screen shot](images/deploy2.png)<br/>

## Setup Frontend
**1. Login to the Auth0 portal, and navigate to your Dashboard**<br/>
**2. Create a "Single Page Web Applications" type Auth0 application**<br/>
![screen shot](images/fe1.png)<br/>
**3. Go to the App settings, and setup the Allowed Callback URLs and Save**<br/>
![screen shot](images/fe2.png)<br/>
![screen shot](images/fe3.png)<br/>
![screen shot](images/fe4.png)<br/>
**4. Copy "domain" and "client id" to save in the /client/src/config.ts file and edit API endpoint**<br/>
![screen shot](images/fe5.png)<br/>
![screen shot](images/fe6.png)<br/>
**5. Run Frontend**
- Move to folder /client
- Type : npm install <br/>
- Type : npm start <br/>
![screen shot](images/client.png)<br/>
**6. Go to browser and check app running**
![screen shot](images/run.png)<br/>

## Use App

**1. Login**
![screen shot](images/run1.png)<br/>
![screen shot](images/run2.png)<br/>
**2. Create Newtask**<br/>
![screen shot](images/run3.png)<br/>
**3. Update task (image, process)**<br/>
![screen shot](images/run4.png)<br/>
![screen shot](images/run5.png)<br/>
![screen shot](images/run6.png)<br/>
![screen shot](images/run7.png)<br/>
**4. Delete task**<br/>
![screen shot](images/run8.png)<br/>
![screen shot](images/run9.png)<br/>

## Check Log app

- Go to AWS -> CloudWatch -> Log Group<br/>
![screen shot](images/log.png)<br/>
![screen shot](images/log1.png)<br/>


