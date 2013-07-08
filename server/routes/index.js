
/*
 * GET home page.
 */

exports.index = function(req, res, db){

    collection = db.collection('dip_clients');

    collection.find().toArray(function(err, items) {

        res.render('index', { title: 'DIP Server', items: items});  

    });;

};