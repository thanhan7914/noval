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

let funcs = ['toSQL','clone','timeout','with','withWrapped','withRecursive','withRecursiveWrapped','columns','as','withSchema','table','distinct','distinctOn','join','innerJoin','leftJoin','leftOuterJoin','rightJoin','rightOuterJoin','outerJoin','fullOuterJoin','crossJoin','joinRaw','where','whereColumn','orWhere','orWhereColumn','whereNot','whereNotColumn','orWhereNot','orWhereNotColumn','_objectWhere','whereRaw','orWhereRaw','whereWrapped','whereExists','orWhereExists','whereNotExists','orWhereNotExists','whereIn','orWhereIn','whereNotIn','orWhereNotIn','whereNull','orWhereNull','whereNotNull','orWhereNotNull','whereBetween','whereNotBetween','orWhereBetween','orWhereNotBetween','groupBy','groupByRaw','orderBy','_orderByArray','orderByRaw','_union','union','unionAll','intersect','having','orHaving','havingWrapped','havingNull','orHavingNull','havingNotNull','orHavingNotNull','havingExists','orHavingExists','havingNotExists','orHavingNotExists','havingBetween','orHavingBetween','havingNotBetween','orHavingNotBetween','havingIn','orHavingIn','havingNotIn','orHavingNotIn','havingRaw','orHavingRaw','offset','limit','count','min','max','sum','avg','countDistinct','sumDistinct','avgDistinct','increment','decrement','clearCounters','first','connection','pluck','clearSelect','clearWhere','clearOrder','clearHaving','insert','update','returning','delete','truncate','columnInfo','forUpdate','forShare','skipLocked','noWait','fromJS','modify','_counter','_bool','_not','_joinType','_aggregate','_clearGrouping','_isSelectQuery','_hasLockMode','select','column','andWhereNot','andWhereNotColumn','andWhere','andWhereColumn','andWhereRaw','andWhereBetween','andWhereNotBetween','andHaving','andHavingIn','andHavingNotIn','andHavingNull','andHavingNotNull','andHavingExists','andHavingNotExists','andHavingBetween','andHavingNotBetween','from','into','del','toQuery','then','options','debug','transacting','stream','pipe','bind','catch','finally','asCallback','spread','map','reduce','thenReturn','return','yield','ensure','reflect','get','mapSeries','delay','queryContext','getData','emit','addListener','on','once'];

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
            await this.constructor.getBuilder()
                .where(this.constructor.__primaryKey, this.primary)
                .update(obj);
        else
        {
            this.exists = true;
            let query = await this.constructor.getBuilder().insert(obj);
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
        let builder = db(toTableName(this.__tableName));
        builder.getData = builder.getData.bind(builder, this);
        return builder;
    }

    static find(id) {
        let primaryKey = this.__primaryKey;
        
        return this.getBuilder()
            .where(primaryKey, id)
            .first()
            .getData();
    }

    get primaryValue() {
        return this.primary;
    }
}

Model.initialize = function() {
    for(let fn of funcs)
        Model[fn] = function(...oths) {
            let builder = db(toTableName(this.__tableName));
            builder.getData = builder.getData.bind(builder, this);
            return builder[fn](...oths);
        }
};

module.exports = Model;
