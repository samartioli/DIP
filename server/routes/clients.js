var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('dipdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'dipdb' database");
        db.collection('dip_clients', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'dip_clients' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.db = db;

exports.findById = function(req, res) {
    var name = req.params.name;
    console.log('Retrieving client: ' + name);
    db.collection('dip_clients', function(err, collection) {
        collection.findOne({'name':name}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('dip_clients', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

// exports.findAll_interal = function() {
//     collection = db.collection('dip_clients');
//     return collection.find();
// };

 
exports.addClient = function(req, res) {
    var client = req.body;
    console.log('Adding client: ' + JSON.stringify(client));
    db.collection('dip_clients', function(err, collection) {
        collection.insert(client, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateClient = function(req, res) {
    var name = req.params.name;
    var client = req.body;
    console.log('Updating client: ' + name);
    console.log(JSON.stringify(client));
    db.collection('dip_clients', function(err, collection) {
        collection.update({'name':name}, client, {safe:true, upsert:true}, function(err, result) {
            if (err) {
                console.log('Error updating client: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(client);
            }
        });
    });
}
 
exports.deleteClient = function(req, res) {
    var name = req.params.name;
    console.log('Deleting client: ' + name);
    db.collection('dip_clients', function(err, collection) {
        collection.remove({'name':name}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var dip_clients = [
    {
        name: "localhost",
        ip: "127.0.0.1"
    }];
 
    db.collection('dip_clients', function(err, collection) {
        collection.insert(dip_clients, {safe:true}, function(err, result) {});
    });
 
};
