const mongoose = require('mongoose');
//mongoose schema
const tourSchema = new mongoose.Schema({
    name: {
        type: String,   //schema
        required: [true, 'A tour must have a name'] , //schema options
        unique: true 
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
       type: Number,
       required:[true, 'A tour must have a price'] 
    }
});


//create mongoose model - mongoose.model('modelname', schema)

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;