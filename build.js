console.log('========= RUNNING BUILD.JS ==========');

var fs = require('fs');
var dotEnv = require('dotenv');
var environmentsFolder = './src/environments';
dotEnv.config({ override: true });

// --
console.log('... starting creating (if not exist) environments folder');
try {
  if (!fs.existsSync(environmentsFolder)) {
    fs.mkdirSync(environmentsFolder);
  }
} catch (err) {
  console.error(err);
}
console.log('... finished');


// --
console.log('... starting creating environment.ts');
try {
  var content = 'export const environment = {';
  content += '\n\tproduction: ' + process.env.PRODUCTION + ',';
  content += '\n\tapi: "' + process.env.API + '",';
  content += '\n};';
  fs.writeFileSync(environmentsFolder + '/environment.ts', content);
} catch (err) {
  console.log(err);
}
console.log('... finished');
// --

// --
console.log('... starting creating proxy.conf.json');
try {
  var content = '{';
  content += '\n\t"/api/*": {';
  content += '\n\t\t"target": "' + process.env.API + '",';
  content += '\n\t\t"secure": ' + process.env.HTTPS + ',';
  content += '\n\t\t"logLevel": "debug"';
  content += '\n\t}';
  content += '\n}';

  fs.writeFileSync('./src/proxy.conf.json', content);
} catch (err) {
  console.log(err);
}
console.log('... finished');
// --