const Model = require('../lib/base/model');

class Phone extends Model {
    static get __primaryKey() {
        return 'user_id';
    }
}

Phone.initialize();

class Address extends Model {
    user() {
        return this.belongsTo(User);
    }
}

Address.initialize();

class User extends Model {
    static get fillable() {
        return ['user'];
    }

    phones() {
        return this.hasOne(Phone, 'id', 'user_id');
    }

    addresses() {
        return this.hasOne(Address);
    }
}

User.initialize();

(async function() {
    let user = await User.find(2);

    // console.log(user);
    let address = await Address.find(8);
    address.user().then(console.log);
    // user.password = 'con ga';
    
    // // // let c = user.phones();
    // // console.log(user.addresses());
    // let a = new Address({
    //     address: '12 aghska'
    // });

    // await user.addresses().save(a);
    // await user.save();
    // console.log(user);
    // await user.del();
})();
