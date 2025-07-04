const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');  // Morgan is popular logging middleware which allows to see request data in console.
const tourRouter = require('./routers/tourRouters');
const userRouter = require('./routers/userRouters');




//1) MIDDLEWARES
if(process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'));
}

// app.use(morgan('dev'));
app.use(morgan('tiny'));
app.use(express.json());  // middleware


app.use(express.static(`${__dirname}/public`));


app.use((req,res,next)=>{
   console.log('Hello from the middleware 👋');
   next();  //next() is mandatory to pass the middleware next queue of response
});

app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString(); //Setting middleware at requested time
    next();
})




// 2) ROUTE HANDLERS
/*
app.get('/api/v1/tours',getAllTours); // Get all Data
app.post('/api/v1/tours',createTour); //Create user
app.get('/api/v1/tours/:id', getTour); //Data Get by individual id
app.patch('/api/v1/tours/:id', updateTour); // Patch or update data
app.delete('/api/v1/tours/:id',deleteTour); //Delete
*/

//3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);


// 4) START SERVER
module.exports = app;