var file=require("fs");
var certs=file.readFileSync("./cert",'utf8');
certs=certs.replace(/BEGIN CERTIFICATE-----\n/g,'BEGIN#####');
certs=certs.replace(/\n-----END CERTIFICATE/g,'#####END');
var allCerts=certs.match(/BEGIN#####([\s\S]*?)#####END/g);
var lastCert=allCerts[allCerts.length-1].replace(/BEGIN#####/g,'-----BEGIN CERTIFICATE-----\n');
lastCert=lastCert.replace(/#####END/g,'\n-----END CERTIFICATE-----');
file.writeFileSync("./cert", lastCert, "utf8");
