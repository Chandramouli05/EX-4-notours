const fs = require('fs');

const tours = JSON.parse( 
    fs.readFileSync(`${__dirname}/../data.json`)
); // mapping data.json to the tours

exports.checkBody = (req,res,next)=>{

    if(!req.body.name ||!req.body.price){
        res.status(400).json({
            status:'fail',
            message:'Missing name or price'
        })
    }

    next();
}

exports.checkID = (req,res,next,val)=>{
    const id = req.params.id * 1;
    const tourIndex = tours.findIndex(tour => tour.id === id);

    if(tourIndex === -1){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    tours.splice(tourIndex, 1);
    next();

};


exports.getAllTours = (req,res)=>{
    console.log(req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data:{
            tour:tours
        }
    });
}
exports.getTour = (req,res)=>{
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
}

exports.createTour = (req,res)=>{
    console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id:newId},req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/data.json`, JSON.stringify(tours), err =>{
        
        if(err){
          return res.status(404).json({
               status: 'fail',
               message: 'Invalid Data'
             });
        }
       

        res.status(201).json({  // 201 OK is to add new element in the DB
            status: 'success',
            data:{
                tour: newTour
            }
        })
    });

}




exports.updateTour = (req,res)=>{
    console.log(req.body);
 if(req.params.id * 1 > tours.length){
    return res.status(404).json({
        status: 'fail',
        message: 'Invalid ID'
    })

 }

 res.status(200).json({
    status: 'success',
    data:{
        tour: '<Updated data here....>'
    }
 })
   
}

exports.deleteTour =  (req,res)=>{   
    res.status(204).json({  // 204 OK is to delete element from the DB
        status: 'success',
        data: null
    })
}
