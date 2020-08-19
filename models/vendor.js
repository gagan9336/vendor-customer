var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: Number,
        required: true,
        unique: true

    },
    password: String,
})
// userschema.methods.validPassword = function (pwd) {
//     // EXAMPLE CODE!
//     return (this.password === pwd);
// };
userschema.plugin(passportLocalMongoose, { usernameField: 'email' });
module.exports = mongoose.model("User", userschema);