const fs = require('fs');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./utils/apiFeatures');


// 5) Aliasing
exports.aliasTopTours = (req,res,next) =>{
  req.query.limit = '5';
  req.query.sort ='-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage';
  next();
}

exports.getAllTours = async (req,res)=>{

    try{
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
    }catch(err){
        res.status(404).json({
        status:'fail',
        message: err
    }) 
    }

}

exports.getTour = async (req,res)=>{
  try{
   const tour =  await Tour.findById(req.params.id);
   // Tour.findOne({__id: req.params.id })

   res.status(200).json({
    status:'success',
    data:{
        tour
    }
   });
  }catch(err){
    res.status(404).json({
        status:'fail',
        message: err
    });
  }
    
}

exports.createTour = async (req,res)=>{
try{
//  const newTour = new Tour({})
//  newTour.save();
  const newTour = await Tour.create(req.body);
    
  res.status(201).json({  // 201 OK is to add new element in the DB
    status: 'success',
    data: {
        tour: newTour
    }
   })
}catch(err){
    res.status(400).json({
        status:'fail',
        message: err
    })
}
} 

exports.updateTour = async (req,res)=>{

    try{

     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true
     });
      res.status(200).json({
        status:'success',
        data:{
            tour
        }
      })
    }catch(err){

    res.status(404).json({
       status: 'fail',
       message: err
    });

    }


   
}

exports.deleteTour = async (req,res)=>{ 
    
    try{
        await Tour.findByIdAndDelete(req.params.id);
      res.status(204).json({  // 204 OK is to delete element from the DB
        status: 'success',
        data: null
    })
    }catch(err){
        res.status(404).json({
            status:'fail',
            message: err
        });
    }
   
}

exports.getTourStats = async(req,res)=>{
  try{
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
  }catch(err){
    res.status(404).json({
      status:'failed',
      data:err
    })
  }
}


exports.getMonthlyPlan = async(req,res) =>{
  try{
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
  }catch(err){
    res.status(404).json({
      status:'failure',
      data: err
    })

  }
}