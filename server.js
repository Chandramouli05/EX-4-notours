const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const Tour = require('./models/tourModel');

dotenv.config({path: './config.env'});

//console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    
    console.log('DB Connection Successful');
})

 const testTour = new Tour({
    name: 'The Foresha Hiker',
    rating: 4.7,
    price: 497
 });

testTour.save().then(doc =>{
    console.log(doc);
}).catch(err =>{
    console.log(err);
});


const port = process.env.PORT || 4000;
app.listen(port,()=>{
    console.log(`App running on port ${port}.....`);
});