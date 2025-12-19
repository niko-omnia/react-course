const mongoose = require('mongoose');
require('dotenv').config();

const Person = mongoose.model('Person', new mongoose.Schema({
    name: String,
    number: String
}));

async function startConnection() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oq9juyb.mongodb.net/?appName=Cluster0`);
}

function endConnection() {
    mongoose.connection.close();
}

async function findPersonById(id) {
    let result = null;
    try { result = await Person.findOne({ _id: id });
    } catch {}
    return result;
}

async function findPersonByName(name) {
    return await Person.findOne({ name: name });
}

async function updateNumber(id, number) {
    let result = null;
    try {
        result = await Person.findByIdAndUpdate(
            id,
            { number },
            { new: true }
        );
    } catch {}
    return result;
}

async function createPerson(name, number) {
    const newPerson = new Person({
        name: name,
        number: number
    });
    return await newPerson.save();
}

async function deletePerson(id) {
    let result = null;
    try {
        result = await Person.deleteOne({ _id: id });
    } catch {}
    return result && result.acknowledged ? { _id: id } : null;
}

async function getPersons() {
    return await Person.find({});
}

module.exports = {
    connection: {
        start: startConnection,
        end: endConnection
    },
    person: {
        findById: findPersonById,
        findByName: findPersonByName,
        updateNumber: updateNumber,
        create: createPerson,
        delete: deletePerson,
        getAll: getPersons
    }
};
