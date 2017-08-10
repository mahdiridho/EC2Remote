#! /usr/bin/env node
/*!
 * Pre-setup AWS services, roles, and policies
 * Mahdi Ridho
 */

/* Load modules */
aws = require("aws-sdk");
aws.config.update({
  region: "ap-northeast-1",
  credentials: new aws.SharedIniFileCredentials({profile: "YOUR_CREDENTIAL_PROFILE"})
});
cognito = new aws.CognitoIdentity();
iam = new aws.IAM();
file = require("fs");

function getPrefix(argsIn){
  var args = argsIn.slice(2);
  if (args.length!=1) {
    console.log('wrong arg count');
    var scriptName=argsIn[1].match(/([^\/]*)\/*$/)[1];
    console.log('Usage: '+scriptName+' projectPrefix');
    console.log('For example :');
    var name = __dirname.match(/([^\/]*)\/*$/)[1];
    console.log('\t'+scriptName+' '+name.toLowerCase());
    return '';
  }
  return args[0];
}

function updateFile(filePath,expression,newValue){
  dynamicValue=file.readFileSync(filePath,'utf8');
  oldValue=dynamicValue.match(expression);
  newFile=dynamicValue.replace(oldValue[1],newValue);
  file.writeFileSync(filePath, newFile, "utf8");
}

// get the prefix or exit
prefix=getPrefix(process.argv);
if (!prefix)
  return;

// Get thumbprint
thumbprint=file.readFileSync("cert",'utf8');
thumbprint=thumbprint.replace(/\n/g,'');

cognitoParam = {
  "IdentityPoolName": prefix+"_pool",
  "AllowUnauthenticatedIdentities": true,
  "OpenIdConnectProviderARNs": ["YOUR_OPENID_CONNECT_ARN"],
  "DeveloperProviderName": "Mahdi"
}

iam.getOpenIDConnectProvider({OpenIDConnectProviderArn: "YOUR_OPENID_CONNECT_ARN"}, function(err, openID) {
	if(openID){
		return "OpenID "+openID.Url+" exists";
	}else{
		iam.createOpenIDConnectProvider({
			ClientIDList: ["Auth0_CLIENID"],
			ThumbprintList: [thumbprint],
			Url: "Auth0_URL"
		}, function(err, data) {
      console.log("Try to connect OpenID with auth0");
      if (err) {
		  	console.log("Error : create OpenID Connect");
      } else {
				// Create pool ID
				cognito.createIdentityPool(cognitoParam, function (err, poolDetail) {
				  console.log("Try to create cognito pool id");
				  if (err) {
				  	console.log("Error : create cognito pool id");
				  } else {
				  	console.log(poolDetail.IdentityPoolId+"\n");
						updateFile("./delete.js",'poolID = "(.*)";',poolDetail.IdentityPoolId);
						updateFile("../app/src/index-view.html",'pool-id="(.*)"',poolDetail.IdentityPoolId);

						/* AssumeRolePolicyDocument value for iam UnAuthenticated Role */
						unAuthRoleData = {
						  "Version": "2012-10-17",
						  "Statement": [
						    {
						      "Effect": "Allow",
						      "Principal": {
						        "Federated": "cognito-identity.amazonaws.com"
						      },
						      "Action": "sts:AssumeRoleWithWebIdentity",
						      "Condition": {
						        "StringEquals": {
						          "cognito-identity.amazonaws.com:aud": poolDetail.IdentityPoolId
						        },
						        "ForAnyValue:StringLike": {
						          "cognito-identity.amazonaws.com:amr": "unauthenticated"
						        }
						      }
						    }
						  ]
						}
						unAuthRoleData = JSON.stringify(unAuthRoleData);
						unAuthRoleParam = {
						  "AssumeRolePolicyDocument": unAuthRoleData,
						  "RoleName": prefix+"_unauth"
						}

					  /* Create AWS unauthrole */
					  iam.createRole(unAuthRoleParam, function(err, unauthRole) {
					    console.log("Try to create AWS Unauth Role");
					    if (err) {
						  	console.log("Error : create unauth role");
					    } else {
					    	console.log(unauthRole);

								/* AssumeRolePolicyDocument value for iam Authenticated Role */
								authRoleData = {
								  "Version": "2012-10-17",
								  "Statement": [
								    {
								      "Effect": "Allow",
								      "Principal": {
								        "Federated": "cognito-identity.amazonaws.com"
								      },
								      "Action": "sts:AssumeRoleWithWebIdentity",
								      "Condition": {
								        "StringEquals": {
								          "cognito-identity.amazonaws.com:aud": poolDetail.IdentityPoolId
								        },
								        "ForAnyValue:StringLike": {
								          "cognito-identity.amazonaws.com:amr": "authenticated"
								        }
								      }
								    }
								  ]
								}
								authRoleData = JSON.stringify(authRoleData);
								AuthRoleParam = {
								  "AssumeRolePolicyDocument": authRoleData,
								  "RoleName": prefix+"_auth"
								}

							  /* Create AWS authrole */
							  iam.createRole(AuthRoleParam, function(err, authRole) {
							    console.log("Try to create AWS Auth Role");
							    if (err) {
								  	console.log("Error : create auth role");
							    } else {
							    	console.log(authRole);

										/* PolicyDocument value for iam unauth policy */
										unauthPolicyData = {
										  "Version": "2012-10-17",
										  "Statement": [
										    {
										      "Effect": "Deny",
										      "Action": "*",
										      "Resource": "*"
										    }
										  ]
										}
										/* PolicyDocument value for iam unauth policy */
								    unauthPolicyData=JSON.stringify(unauthPolicyData);
										/* Parameter for iam unauth policy */
										unauthPolicyParam = {
											"PolicyDocument": unauthPolicyData,
											"PolicyName": prefix+"_unauth",
											"RoleName": prefix+"_unauth"
										}

									  /* Put AWS iam unauth policy */
							      iam.putRolePolicy(unauthPolicyParam, function(err, unauthPolicy) {
							        console.log("Try to put AWS unauth Policy");
							        if (err) {
										  	console.log("Error : create unauth policy");
							        } else {
							        	console.log(unauthPolicy);

												/* PolicyDocument value for iam auth policy */
												authPolicyData = {
												  "Version": "2012-10-17",
												  "Statement": [
												    {
												      "Action": [
												        "ec2:DescribeInstanceAttribute",
												        "ec2:DescribeInstanceStatus",
												        "ec2:DescribeInstances",
												        "ec2:StartInstances",
												        "ec2:StopInstances"
												      ],
												      "Effect": "Allow",
												      "Resource": "*"
												    }
												  ]
												}

										    authPolicyData=JSON.stringify(authPolicyData);
												/* Parameter for iam auth policy */
												authPolicyParam = {
													"PolicyDocument": authPolicyData,
													"PolicyName": prefix+"_auth",
													"RoleName": prefix+"_auth"
												}

											  /* Put AWS iam auth policy */
									      iam.putRolePolicy(authPolicyParam, function(err, authPolicy) {
									        console.log("Try to put AWS auth Policy");
									        if (err) {
												  	console.log("Error : create auth policy");
									        } else {
									        	console.log(authPolicy);

									        	identityParam = {
									        		"IdentityPoolId": poolDetail.IdentityPoolId, 
									        		"Roles": {
									        			"unauthenticated": unauthRole.Role.Arn, 
									        			"authenticated": authRole.Role.Arn
									        		}
									        	}

													  /* Set identity pool roles */
													  cognito.setIdentityPoolRoles(identityParam, function(err, data) {
													    console.log("Try to set identity");
													    if (err) {
														  	console.log("Error : set cognito id");
													    } else {
													      console.log(data); // successful response
													    }
													  })
									        }
									      })
							        }
							      })
							    }
							  })
					    }
					  })
					}
				})
			}
		});
	}
});