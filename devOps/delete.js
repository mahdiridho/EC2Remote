#! /usr/bin/env node
/*!
 * Delete AWS services, roles, and policies
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
Q = require("q");

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

// Dynamic variables
poolID = "COGNITO_POOL_ID";

// Find the prefix or exit
prefix=getPrefix(process.argv);
if (!prefix)
  return;

/* Check OpenID Connect */
iam.getOpenIDConnectProvider({OpenIDConnectProviderArn: "YOUR_OPENID_CONNECT_ARN"}, function(err, openID) {
	if(openID){
		// delete as required
		Q.fcall( function () {
			/* Delete OpenID Connect */
	    return new Promise(function tryPromise(resolve) {
		    iam.deleteOpenIDConnectProvider({OpenIDConnectProviderArn: "YOUR_OPENID_CONNECT_ARN"}, function(err, data) {
			    console.log("Try to delete OpenID");
			    if (err) {
			      setTimeout(function(){
			          return tryPromise(resolve); // Loop promises when get error
			      },2000);
			    } else {
			      return resolve(data); // successful response
			    }
			  });
			 });
		}).then( function (deleteOpenID) {
			console.log(deleteOpenID);

			/* Delete cognito pool id */
	    return new Promise(function tryPromise(resolve) {
				cognito.deleteIdentityPool({IdentityPoolId: poolID}, function (err, data) {
				  console.log("Try to delete cognito pool id");
				  if (err) {
	          setTimeout(function(){
		          return tryPromise(resolve); // Loop promises when get error
	          },2000);
				  } else {
				    return resolve(data);
				  }
				});
			});
		}).then( function (poolID) {
			console.log(poolID);

		  /* Delete AWS unauth Policy from IAM Role */
		  params = {
		    PolicyName: prefix+"_unauth", 
		    RoleName: prefix+"_unauth"
		  };
		  return new Promise(function tryPromise(resolve) {
		    iam.deleteRolePolicy(params, function(err, data) {
		      console.log("Try to delete AWS unauth Policy ");
		      if (err) {
		        setTimeout(function(){
	            return tryPromise(resolve); // Loop promises when get error
		        },2000);
		      } else {
		      	return resolve(data);
		    	}
		    });
		  });
		}).then( function (unauthPolicy) {
			console.log(unauthPolicy);

		  /* Delete AWS auth Policy from IAM Role */
		  params = {
		    PolicyName: prefix+"_auth", 
		    RoleName: prefix+"_auth"
		  };
		  return new Promise(function tryPromise(resolve) {
		    iam.deleteRolePolicy(params, function(err, data) {
		      console.log("Try to delete AWS auth Policy ");
		      if (err) {
		        setTimeout(function(){
	            return tryPromise(resolve); // Loop promises when get error
		        },2000);
		      } else {
		      	return resolve(data);
		    	}
		    });
		  });
		}).then( function (authPolicy) {
			console.log(authPolicy);

		  /* Delete AWS role for unauth users */
		  return new Promise(function tryPromise(resolve) {
		    iam.deleteRole({RoleName: prefix+"_unauth"}, function(err, data) {
		      console.log("Try to delete AWS unauth Role");
		      if (err) {
						setTimeout(function(){
							return tryPromise(resolve); // Loop promises when get error
						},2000);
		      } else {
		      	return resolve(data); // successful response
		      }
		    });
		  });
		}).then( function (unauthRole) {
			console.log(unauthRole);

		  /* Delete AWS role for auth users */
		  return new Promise(function tryPromise(resolve) {
		    iam.deleteRole({RoleName: prefix+"_auth"}, function(err, data) {
		      console.log("Try to delete AWS auth Role");
		      if (err) {
						setTimeout(function(){
							return tryPromise(resolve); // Loop promises when get error
						},2000);
		      } else {
		      	return resolve(data); // successful response
		      }
		    });
		  });
		}).then( function (authRole) {
			console.log(authRole);
		}).fail( function (error) {
			console.error(error);
		});
	}
});