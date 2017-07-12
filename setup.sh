# check for $1 on the system and report if not installed
function checkInstalled {
instPKG=`dpkg-query -W --showformat='${Status}\n' $1 | grep -c "install ok installed"`
if [ $instPKG -lt "1" ]; then
    echo
    echo $1 not installed, please run the following to install and try again
    echo sudo apt-get install $1
    echo
    exit 1
fi
}

function checkBinaryExists {
  present=`which $1`
  if [ -z "$present" ]; then
    echo
    echo $1 can\'t be found, please install the package which contains the binary
    echo
    exit 1
  fi
}

# check if $1 is installed by npm and report if not installed
function checkGlobalNPMInstalled {
    echo checking global npm node_modules for $1
    instPKG=`npm ls -g $1 2>&1  | grep -c empty`
    if [ $instPKG -gt "0" ]; then
	echo
	echo $1 not installed, please run the following to install and try again
	echo sudo npm install -g $1
	echo
	exit 1
    fi
}

echo checking for system requirements
checkInstalled nodejs
#checkInstalled nodejs-legacy
checkBinaryExists npm

echo checking for npm requirements
checkGlobalNPMInstalled bower
checkGlobalNPMInstalled gulp

npm install

# Preconfig webapp
echo Pre config webapp components
cd webapp

# Install all components using
bower install