const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const mongoProviders = {};

const cont = {};

class MongoProvider {
    model;
    constructor(collection, schema) {
        this.model = mongoose.model(collection, schema);
    }

    tryFindingFilter(data) {
        const filter = {};
        if (data.hasOwnProperty("_id")) {
            filter._id = data._id;
        }
        return filter;
    }

    async save(data) {
        const filter = this.tryFindingFilter(data);
        console.log(filter);
        
        return await this.model.findOneAndUpdate(filter, data, { upsert: false, new: false })
    }

    async destroy(data) {
        const filter = this.tryFindingFilter(data);
        await this.model.deleteOne(filter);
    }

    async create(data) {
        try {
            return await new this.model(data).save();
        } catch (err) {
            console.log(err);
        }
    }

    // Bunch of helper methods
    async getByFilter(filter) {
        return await this.model.find(filter);
    }

    async getOneByFilter(filter) {
        return await this.model.findOne(filter);
    }

    async getTable() {
        return await this.model.retrieveFiltered({});
    }

    async removeByFilter(filter) {
        await this.model.deleteMany(filter);
    }

}

function loadModels() {
    console.log("Loading models...");
    var normalizedPath = path.join(__dirname, "models");

    fs.readdirSync(normalizedPath).forEach(function(file) {
        const toBeSchema = require("./models/" + file);
        const mongoProvider = new MongoProvider(toBeSchema.collection, toBeSchema.schema);
        mongoProviders[toBeSchema.collection] = mongoProvider;
    });
}

function getModel(collection) {
    if(!mongoProviders.hasOwnProperty(collection)) throw new Error(`Tried getting model ${collection} which doesn't exist!`);
    return mongoProviders[collection];
}

//TODO: move this
loadModels();

cont.getModel = getModel;

module.exports = cont;
