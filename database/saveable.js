const providerManager = require('./mongoReference');

class Saveable {
    provider;
    data = {};
    constructor(collection, _id) {
        this.data._id = _id;
        this.provider = providerManager.getModel(collection);
    };

    async save() {
        return await this.provider.save(this.data);
    }

    async destroy() {
        await this.provider.destroy(this.data);
    }

    async create() {
        const res = await this.provider.create(this.data);
        this._id = res._id;
        return res;
    }

    get _id() {
        return this.data._id;
    }

    set _id(value) {
        this.data._id = value;
    }

}

module.exports = Saveable;
