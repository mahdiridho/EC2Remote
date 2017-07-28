# Get Certificate
echo "Creating thumbprint certificate..."
openssl s_client -showcerts -connect flatmax.au.auth0.com:443 > cert &
PID=$!
wait $PID
sleep 1
node thumbprint/getCert.js
preSHA="`openssl x509 -in cert -fingerprint -noout`"
preSHA="${preSHA/SHA1 Fingerprint=/}"
echo $preSHA | sed -e "s/://g" > cert