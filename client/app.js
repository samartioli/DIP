
/**
 * Module dependencies.
 */

var http = require('http')
  , optimist = require('optimist')
  , os = require('os')
  , request = require('request')
  ;

var argv = optimist
    .usage('Dynamic IP Home Client.\nUsage: $0')
    .options('n', {
        alias: 'name',
        describe: "This clients name to send to server"
    })
    .options('s', {
        alias: 'server',
        describe: "The remote server hostname"
    })
    .options('p', {
        alias: 'port (remote)',
        describe: "The remote server port",
        default: '3334'
    })
    .options('i', {
        alias: 'interval',
        describe: "Polling Interval",
        default: "180000"
    })
    .options('h', {
        alias: 'help',
        describe: "Show Help"
    })
    .demand(['n', 's'])
    .argv
;

if (argv.help) {
    optimist.showHelp();
    process.exit(0);
}

var interfaces = os.networkInterfaces();
var addresses = null;

var intervalId = setInterval(function() {

    for (k in interfaces) {
        for (k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family == 'IPv4' && !address.internal) {
                if ( addresses != address.address ) {
                    console.log('### INFO: ip address changed. Updating Server');
                    addresses = address.address;
                    sendRequest(addresses);
                }
            }
        }
    }

    //console.log('looping... ' + addresses);

}, argv.i);

sendRequest = function(ip) {

    var server = 'http://' + argv.s + ':' + argv.p + '/clients/' + argv.n;

    request.put(
        server,
        {
            form: { 
                name: argv.n,
                ip: ip
            },
            json: true
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            } else {
                console.log('### ERROR: ' + error);
                console.log('### STATUS CODE: ' + response.statusCode);
                console.log(body);
            }
        }
    );

}



