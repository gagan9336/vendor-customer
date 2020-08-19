const mongoose = require('mongoose');

const productSchema = new mongoose.Schema ({
    name: String,
    image: String,
    description: String,
    price: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

module.exports = mongoose.model('Product', productSchema);