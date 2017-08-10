# EC2Remote

Web Client to remote AWS EC2 using VNC service


## Getting Started

Client apps can be run live either in localhost or server, it use gulp to start locally.
You must run devOps if the services don't exist yet on the AWS cloud. To run devOps, make sure you have create the aws credential. To get the key, please log on to your AWS console and do the following step :

* click your account menu on the right top corner
* select My security Credentials
* select Users on the left side menu
* select your User name
* select Security credentials tab
* create access key
* save your access key to the file at ~/.aws/credentials with the following content :

[default] /* It is credentital profile can be set free name i.e. mahdi */

aws_access_key_id = <access_id>
aws_secret_access_key = <secret_id>


## Installing

### Pre install local packages

Run the setup command from the local project directory to install pre-requisites :

$ ./setup.sh


### Configure the backend system

Go to the directory "devOps" and Prepare services, roles, and policies, run the command :

$ ./create.sh <prefix_name>

to remove :

$ ./delete.sh <prefix_name>

Before run, some contents in both files need to change base on yours :

* YOUR_CREDENTIAL_PROFILE : credential profile you have set above
* YOUR_OPENID_CONNECT_ARN : OpenID Arn can be found on AWS IAM - Identity providers - click your provider name. The sample Arn will be like i.e arn:aws:iam::5199957xxxxx:oidc-provider/<PROVIDER_DOMAIN>.

Please read the reference to configure OpenID with Auth0 on folder AUTH0_OPENID_COGNITO

### Running the application

From project folder, run the noVNC as service :

$ ./noVNC/utils/launch.sh --vnc ec2-x-x-x-x.ap-northeast-1.compute.amazonaws.com:5901

Then from project folder on other command console:

$ gulp

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/EC2_VNC_PREINSTALL/images/noVNC.png)

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/EC2_VNC_PREINSTALL/images/WebRemote.png)

If you want to run on public server, just upload all files from folder "webapp" to your public server


## REMOVE & UNINSTALL

$ ./uninstall.sh
