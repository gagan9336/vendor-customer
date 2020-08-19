var mongoose = require("mongoose");
const bycrypt = require('bcryptjs');



var userSchema1 = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true

    },
    password: String,
});

userSchema1.statics.findByCredentials = async (email, password) => {
    const user = await User1.findOne({ email })

    if (!user) {
        throw new Error('unable to log in');
    }
    const isMatch = await bycrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error ('unable to log in');
    }
    return user;
}

userSchema1.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bycrypt.hash(user.password, 8);

    }

    next();
});

module.exports = mongoose.model("User1", userSchema1);