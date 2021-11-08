const { MongoClient } = require('mongodb');

module.exports = class DbService {
    constructor (connInfo = {}) {
        const {
            protocol,
            username,
            password,
            hostname,
            database
        } = connInfo
        this.url = `${protocol}://${username}:${password}@${hostname}/${database}?retryWrites=true&w=majority`
        console.log(this.url)
        this.client = new MongoClient(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = database
    }

    async connect(schema) {
        if (!schema) throw Error ('We need schema!!!')
        await this.client.connect();
        console.log('Connected successfully to server');
        const db = this.client.db(this.dbName);
        const collection = db.collection(schema);
        console.log('done')
        return collection
    }

    async insert(schema, data = []) {
        const collection = await this.connect(schema)
        collection.insertMany(data)
    }

    async find(schema, condition = {}){
        const collection = await this.connect(schema)
        return await collection.find(condition).toArray();
    }


}