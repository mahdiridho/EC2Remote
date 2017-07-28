if [ -z "$1" ]; then
	echo "Usage: <command> projectPrefix"
	echo "For example :"
	echo "./create.sh devops"
else
	# get thumbprint and then create aws service
	./thumbprint/thumbprint.sh
	./create.js $1
	rm cert
	echo "done"
fi