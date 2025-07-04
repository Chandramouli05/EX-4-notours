const fs = require('fs');

const users = JSON.parse( 
    fs.readFileSync(`${__dirname}/../data.json`)
); // mapping data.json to the tours

exports.getAllUsers = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

exports.getUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

exports.createUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

exports.updateUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}

exports.deleteUser = (req,res)=>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined',
    })
}
