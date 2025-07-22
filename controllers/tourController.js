const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError').default;
const catchAsync = require('../utils/catchAsync');


// 5) Aliasing
exports.aliasTopTours = (req,res,next) =>{
  req.query.limit = '5';
  req.query.sort ='-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage';
  next();
}

exports.getAllTours = catchAsync(async(req,res,next)=>{

   
      // BUILD QUERY
    const features = new APIFeatures(Tour.find(),req.query).sort().field().pagination();
    const tours = await features.query;

    //   const tours = await Tour.find({
    //     duration: 5,
    //     difficulty: 'easy'
    //   });

    //   const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('maxGroupSize')
    //   .equals(25);

 // EXECUTE QUERY   
 // SEND RESPONSE
       res.status(200).json({
        status: 'success',
        results: tours.length,
        data:{
            tours
        }
    });

});

exports.getTour = catchAsync(async (req,res,next)=>{
 
   const tour =  await Tour.findById(req.params.id);
   // Tour.findOne({__id: req.params.id })

   if(!tour){
   return next(new AppError('No tour found with that ID',404));
   }

   res.status(200).json({
    status:'success',
    data:{
        tour
    }
   });
});



exports.createTour = catchAsync(async (req,res,next)=>{
  const newTour = await Tour.create(req.body);

  res.status(201).json({  // 201 OK is to add new element in the DB
    status: 'success',
    data: {
        tour: newTour
    }
   });

});

exports.updateTour = catchAsync(async (req,res)=>{

     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true
     });

     if(!tour){
   return next(new AppError('No tour found with that ID',404));
   }

      res.status(200).json({
        status:'success',
        data:{
            tour
        }
      })  
})

exports.deleteTour = catchAsync(async (req,res)=>{ 

  const tour =  await Tour.findByIdAndDelete(req.params.id);

    if(!tour){
   return next(new AppError('No tour found with that ID',404));
   }


      res.status(204).json({  // 204 OK is to delete element from the DB
        status: 'success',
        data: null
    })
    
})

exports.getTourStats = catchAsync(async(req,res)=>{
  
    const stats = await Tour.aggregate([
      {
        $match: {ratingsAverage: {$gte:4.5}}
      },
      {
        $group:{
          _id: {$toUpper: `$difficulty`},
          numTours: {$sum:1},
          numRating: {$sum: '$ratingsQuantity'},
          avgRating: {$sum: `$ratingsAverage`},
          avgPrice: {$avg: '$price'},
          minPrice:{$min: `$price`},
          maxPrice:{$max: `$price`},

        }
      },
      {
        $sort: {avgPrice: 1}
      },
      {
        $match: {_id: {$ne:'EASY'}}
      }
       
    ]);
    res.status(200).json({
      status: 'success',
      data:{
        stats
      }
    })
});


exports.getMonthlyPlan = catchAsync(async(req,res) =>{

    const year = parseInt(req.params.year);
    const plan = await Tour.aggregate([
      {
        $unwind: `$startDates`
      },
      {
        $match:{
           startDates:{
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-01`)
           }
        }
      },
      {
        $group:{
          _id: { $month: "$startDates"},
          numTourStarts: {$sum: 1},
          tours:{$push: `$name`}
        }
      },
      {
        $addFields: {month: `$_id`}
      },{
        $project:{
          _id: 0
        }
      },
      {
        $sort: {numTourStarts: -1}
      },
      {
        $limit: 12
      }

    ]);

    //console.log(plan);

    res.status(200).json({
      status: 'success',
      data:{
       plan
      }
    });
})