if [ -z "$1" ]; then
	echo "Usage: <command> projectPrefix"
	echo "For example :"
	echo "./delete.sh devops"
else
	./delete.js $1
	echo "done"
fi