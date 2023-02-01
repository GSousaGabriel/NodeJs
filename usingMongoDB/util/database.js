const mongodb= require('mongodb')
const MongoClient= mongodb.MongoClient

let _db

const mongoConnect= cb=>{
    MongoClient.connect('mongodb+srv://admin:admin@nodepractice.lok4ozc.mongodb.net/shop')
    .then(client=>{
        console.log('connected!')
        _db= client.db()
        cb(client)
    })
    .catch(err=>{
        console.log(err)
    })
}

const getDb= ()=>{
    if(_db){
        return _db
    }
    return 'Error'
}

exports.mongoConnect= mongoConnect;
exports.getDb= getDb;