
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , optimist = require('optimist')
  , clients = require('./routes/clients')
  ;

var argv = optimist
    .usage('Dynamic IP Home Server.\nUsage: $0')
    .options('p', {
        alias: 'port',
        describe: "The port to listen on",
        default: 3334
    })
    .options('h', {
        alias: 'help',
        describe: "Show Help"
    })
    .argv
;

if (argv.help) {
    optimist.showHelp();
    process.exit(0);
}


var app = express();

// all environments
app.set('port', argv.p || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {

    // asd = clients.findAll_interal();
    // console.log(asd.toArray(function() {}));
    routes.index(req, res, clients.db);
});

app.get('/clients', clients.findAll);
app.get('/clients/:name', clients.findById);
app.post('/clients', clients.addClient);
app.put('/clients/:name', clients.updateClient);
app.delete('/clients/:name', clients.deleteClient);

//curl -i -X POST -H 'Content-Type: application/json' -d '{"name": "ClientName", "ip": "123.0.0.1"}' http://localhost:3334/clients
//curl -i -X DELETE http://localhost:3334/clients/ClientName
//curl -i -X PUT -H 'Content-Type: application/json' -d '{"name": "ClientName", "ip": "123.0.0.1"}' http://localhost:3334/clients/ClientName

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
