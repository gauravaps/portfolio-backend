const mongoose =require('mongoose');
const validator = require("validator");

const projectSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    addedBy:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'yourquery',
        required:true,
    },
    
    description:{
        type:String,
        required:true,
    },

    image: {
        type: String,
        default: "https://res.cloudinary.com/gauravkacloud/image/upload/v1731986753/photo_yrra2i.png", 
    },

    liveUrl: {
        type: String,
        required: true,  // Just the type and required field, no validation
    },
    sourceCode: {
        type: String,
        required: true,  // Just the type and required field, no validation
    },
    
    


},{timestamps:true});


const AddProject = mongoose.model('AddProject' , projectSchema)

module.exports = AddProject;