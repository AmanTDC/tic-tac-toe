var MongoClient = require('mongodb').MongoClient;
var {DB_URL} = require('../config/const')
// new Promise(resolve,reject)


var dbo =new Promise(async function(resolve, reject){
    MongoClient.connect(DB_URL, function(err, db) {
        if (err) 
            reject(err);
        else{
            // console.log(db.db('tictactoe'))
            resolve(db.db('tictactoe'));
        }
    })
})
module.exports = {
    dbo
}