# Setup EC2 Instance

1. Create Key Pair
From AWS Console, open EC2 Service, select "Key Pairs" on the EC2 dashboard, then click Create Key Pair

2. Set the key pair name

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/EC2_VNC_PREINSTALL/images/KeyPair.png)

3. Save the Private Key file on the safe local folder

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/EC2_VNC_PREINSTALL/images/SaveKeyPair.png)

4. From EC2 dashboard, go to "Instances" menu and click Launch Instance

5. Choose the image, here will try Ubuntu Server on Free tier package

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/EC2_VNC_PREINSTALL/images/Image.png)

6. Choose Instace type, here will try Free tier package

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/EC2_VNC_PREINSTALL/images/Instance.png)

7. Just "Next" untill Security Group page

8. Add SSH and VNC Server port access, usually VNC Server will set to port number > 5900

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/EC2_VNC_PREINSTALL/images/Security.png)

9. Just "Next" untill set key pair for the instance

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/EC2_VNC_PREINSTALL/images/SetKeyPair.png)

10. Finally click Launch then View Instance


# Setup VNC Server

1. Start EC2 instance
From EC2 dashboard select "Instances", check the active instance, Actions - Instance State - Start

2. Connect to the EC2 image via SSH
Click Connect and run the example command like below on command console :

ssh -i "KeyPair_FullPath" ubuntu@ec2-x-x-x-x.ap-northeast-1.compute.amazonaws.com

3. For ubuntu image, you can follow the following link to install VNC Server :

https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-vnc-on-ubuntu-16-04

Perhaps it needs update the server's package lists on the first time :

$ sudo apt-get update && apt-get -y upgrade

4. Every success install, try connect from VNC Client. On my remmina (VNC Client), I connect with the sample url below :

ec2-x-x-x-x.ap-northeast-1.compute.amazonaws.com:5901

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/EC2_VNC_PREINSTALL/images/VNCConnect.png)

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/EC2_VNC_PREINSTALL/images/VNCRemote.png)
