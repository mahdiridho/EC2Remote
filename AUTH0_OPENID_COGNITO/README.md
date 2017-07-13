![alt text](https://raw.githubusercontent.com/mahdiridho/EC2Remote/master/AUTH0_OPENID_COGNITO/images/OpenID_Auth0.jpeg)

To connect Auth0 to Cognito Identity, it will need to create  an identity provider such as OpenID Connect as gateway. We will register Auth0 Client to OpenID Connect as audience, and then associate the OpenID to Cognito Identity as Authentication Provider. Every OpenID provider need SSL certificate, it will generate automatically if we create on AWS Console. But we need more work to generate manually if we create OpenID by CLI.

# Setup Auth0
1. While logged in to Auth0 account, go to the Client menu.
2. Create new client and choose client type, here we will choose Single Page Application

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/AUTH0_OPENID_COGNITO/images/one.png)

3. While it has finished create new client, click on Settings, We will see Client Domain, ID, and Secret Key.
4. Update the setting info for Name, Description, Callback, CORS

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/AUTH0_OPENID_COGNITO/images/two.png)

For mobile platform either webapp and app, the callback will set to our Auth0 client URL/mobile

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/AUTH0_OPENID_COGNITO/images/three.png)

For mobile application, the CORS will set to file://\*

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/AUTH0_OPENID_COGNITO/images/four.png)

On **Use Auth0 instead of the IdP to do Single Sign On**, it can be enabled or disabled

5. Click Show Advance Settings and select OAuth tab
6. On **JsonWebToken Signature Algorithm**, set to RS256 and Save the updates

![alt text](https://github.com/mahdiridho/EC2Remote/blob/master/AUTH0_OPENID_COGNITO/images/five.png)

Next, we will create new AWS OpenID Connect and register the above Auth0 client as audience using class IAM createOpenIDConnectProvider :

[[ http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createOpenIDConnectProvider-property | Create New OpenID Connect and register new Auth Client ID ]]

If we will add new Auth Client ID to the same OpenID Identity, it will use class IAM addClientIDToOpenIDConnectProvider :

[[ http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#addClientIDToOpenIDConnectProvider-property | Add new Auth Client ID to existing OpenID ]]

> When create new OpenID Connect, it needs Thumbprint certificate on the parameter. How to generate new Thumbprint certificate can be read on the link below :

[[ http://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html | Obtaining the Thumbprint for an OpenID Connect Identity Provider ]]

Lets check the simple Thumbprint generator in CLI :

[[ http://developer.flatmax.org/rBABYLONCOMMdc7d15b2b9b6c98de3b1be7d78968d20dd859bad | Generate new Thumbprint certificate by CLI ]]