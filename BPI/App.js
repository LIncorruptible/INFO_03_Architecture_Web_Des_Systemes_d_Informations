const { MongoClient } = require('mongodb');

const url = 'mongodb://administrateur:administrateur@localhost:27017/bpi';
const client = new MongoClient(url);

const documents = [{ nom: "Enr1", valeur: 100 }, { nom: "Enr2", valeur: 200 }];

async function main() {
    try {
        await client.connect();
        console.log("Test de connexion à la base de données...");

        const db = client.db('bpi');

        const collectionName = 'CollectionTest';
        const collection = db.collection(collectionName);

        await db.createCollection(collectionName);
        console.log(`Collection ${collectionName} créée`);

        await collection.insertMany(documents);
        console.log(`${documents.length} documents insérés`);

        const insertedDocuments = await collection.find({}).toArray();
        console.log("Enregistrements dans la collection:", insertedDocuments);

        await collection.drop();
        console.log(`Collection ${collectionName} supprimée`);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);