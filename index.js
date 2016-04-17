var fetch = require('node-fetch');
var app = require('./app.js');

switch (process.argv[2]) {
  case 'poll':
    app.poll();
    break;
  case 'hook-on':
    app.activateWebhook(process.argv[3]).then(res => console.log(res));
    break;
  case 'hook-off':
    app.deactivateWebhook().then(res => console.log(res));
    break;
  default:
    console.log("Please specify an option. \nOptions are: \nhook-on \nhook-off \npoll.");
    break;
}
