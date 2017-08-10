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
