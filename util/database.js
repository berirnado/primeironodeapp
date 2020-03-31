const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
  MongoClient.connect('mongodb+srv://bernardo:eLdHZvcimLJgqLdS@cluster0-8qvme.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true })
.then(client => {
    console.log("conected");
    callback(client);
})
.catch(err => console.log(err));
}

module.exports = mongoConnect;