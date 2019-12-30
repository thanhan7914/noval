const knex = require('knex');
const Builder = require('knex/lib/query/builder');
const db = require('../db');
const pluralize = require('pluralize');
const _ = require('lodash');

function underscore(name) {
    return name.replace(/(?:^|\.?)([A-Z])/g, function (x,y){
        return '_' + y.toLowerCase()
    }).replace(/^_/, '');
}

function toTableName(name) {
    return underscore(pluralize(name));
}

function copyFunction(source, target, ignore = []) {
    for(let fn in source)
        if(_.isFunction(source[fn]) && !_.isFunction(target[fn])
            && ignore.indexOf(fn) === -1)
            target[fn] = source[fn].bind(source);
}

Builder.prototype.getData = function(className) {
    return this.then(async (rows) => {
        let primary = className.__primaryKey;

        if(_.isArray(rows))
        {
            if(rows.length === 0) return [];

            let collections = [];
            let columns = _.keys(rows[0]);
            if(columns.indexOf(primary) === -1)
            {
                columns.push(className.__primaryKey);
            
                return this.select(columns)
                .then(r => {
                    for(let row of r)
                        collections.push(new className(true, row))
    
                    return collections;
                });    
            }
            
            for(let row of rows)
                collections.push(new className(true, row))

            return collections;
        }

        if(_.isUndefined(rows[primary]))
            rows[primary] = (await this.select(primary))[primary];

        return new className(true, rows);
    });
}

class Model {
    static get __tableName() {
        return this.name;
    }

    static get __columns() {
        return [];
    }

    static get __primaryKey() {
        return 'id';
    }

    constructor(...oths) {
        this.exists = false;
        this.columns = new Set();
        this.storage = {};

        if(oths.length > 0)
        {
            let raw = oths[0];

            if(_.isBoolean(oths[0]))
            {
                this.exists = !_.isUndefined(oths[1]);
                raw = oths[1];

                this.primary = raw[this.constructor.__primaryKey];
            }

            for(let attribute in raw)
            {
                this[attribute] = raw[attribute];
                this.storage[attribute] = raw[attribute];
                this.columns.add(attribute);
            }
        }
    }

    __isChanged() {
        let cols =  new Set(Array.from(this.columns));

        if(!this.exists) return cols;

        for(let col of cols)
            if(this.storage[col] === this[col])
                cols.delete(col);

        return cols;
    }

    async save() {
        let cols = this.__isChanged();

        if(cols.length === 0) return this;

        let obj = {};
        for(let c of cols)
        {
            obj[c] = this[c];
            this.storage[c] = this[c];
        }

        if(this.exists)
            await this.constructor.builder
                .where(this.constructor.__primaryKey, this.primary)
                .update(obj);
        else
        {
            this.exists = true;
            let query = await this.constructor.builder.insert(obj);
            this.primary = query[0];
        }

        return this;
    }

    async del() {
        await this.constructor.getBuilder()
            .where(this.constructor.__primaryKey, this.primary)
            .del();

        return this;
    }

    delete() {
        return this.del();
    }

    static getBuilder() {
        return db(toTableName(this.__tableName));
    }

    get primaryValue() {
        return this.primary;
    }
}

Model.initialize = function() {
    Model.builder = db(toTableName(this.__tableName));
    Model.builder.getData = Model.builder.getData.bind(Model.builder, Model);
    copyFunction(Model.builder, Model);
};

module.exports = Model;
