#! /usr/bin/env node
/*!
 * Pre-setup AWS services, roles, and policies
 * Mahdi Ridho
 */

/* Load modules */
aws = require("aws-sdk");
aws.config.update({
  region: "ap-northeast-1",
  credentials: new aws.SharedIniFileCredentials({profile: "eljawir"})
});
cognito = new aws.CognitoIdentity();
iam = new aws.IAM();
ec2 = new aws.EC2();
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
  "OpenIdConnectProviderARNs": ["arn:aws:iam::355108499559:oidc-provider/mahdiridho.auth0.com"],
  "DeveloperProviderName": "Mahdi"
}

iam.getOpenIDConnectProvider({OpenIDConnectProviderArn: "arn:aws:iam::355108499559:oidc-provider/mahdiridho.auth0.com"}, function(err, openID) {
	if(openID){
		return "OpenID "+openID.Url+" exists";
	}else{
		iam.createOpenIDConnectProvider({
			ClientIDList: ["PNGweNabHkQkDzxIwt4jzGHVSNmUQCyR"],
			ThumbprintList: [thumbprint],
			Url: "https://mahdiridho.auth0.com"
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

																/* Create new key pair */
																ec2.createKeyPair({KeyName:"MahdiKey"}, function(err, ec2Key) {
																  console.log("Try to create New Key Pair");
																  if (err) {
																  	console.log("Error : create ec2 keypair");
																  } else {
																  	console.log(ec2Key);

																  	ec2Param = {
																		  "ImageId": "ami-785c491f",
																		  "MaxCount": 1,
																		  "MinCount": 1,
																		  "InstanceType": "t2.micro",
																		  "KeyName": "MahdiKey"
																		}

																		/* Create new EC2 instance */
															      ec2.runInstances(ec2Param, function(err, ec2Instance) {
															        console.log("Try to create New Instance");
															        if (err) {
															        	console.log(err);
																		  	console.log("Error : create ec2 instance");
															        } else {
															        	console.log("EC2 instance attributes : "+ec2Instance.Instances[0].InstanceId);
																				updateFile("./delete.js",'InstanceId = "(.*)";',ec2Instance.Instances[0].InstanceId);

															        	/* Stop EC2 Instance */
													        	    return new Promise(function tryPromise(resolve) {
													        	      ec2.stopInstances({InstanceIds: [ec2Instance.Instances[0].InstanceId]}, function(err, ec2Stop) {
																		        console.log("Try to stop ec2 instance");
																		        if (err) {
																		          setTimeout(function(){
																		              return tryPromise(resolve); // Loop promises when get error
																		          },2000);
																		        } else {
																		        	console.log("EC2 instance stop : "+JSON.stringify(ec2Stop));

																		        	/* Set ec2 tag name */
																        	    params = {
																					      Resources: [ec2Instance.Instances[0].InstanceId], 
																					      Tags: [{
																					        Key: "Name", 
																					        Value: "MahdiServer"
																					      }]
																					    };
																				      ec2.createTags(params, function(err, ec2Tag) {
																				        console.log("Try to set tag name");
																				        if (err) {
																							  	console.log("Error : set ec2 tag");
																				        } else {
																				          console.log("EC2 instance name : "+JSON.stringify(ec2Tag));
																				        }
																				      });
																		        }
																		      });
																		    });
															        }
															      });
																  }
																});
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