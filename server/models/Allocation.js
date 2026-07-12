const mongoose = require("mongoose");

const allocationSchema = new mongoose.Schema(
{
    asset:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Asset",
        required:true
    },

    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    allocatedDate:{
        type:Date,
        default:Date.now
    },

    expectedReturn:{
        type:Date
    },

    returnedDate:{
        type:Date
    },

    status:{
        type:String,
        enum:["Allocated","Returned"],
        default:"Allocated"
    },

    conditionOnReturn:{
        type:String,
        default:""
    }

},
{timestamps:true});

module.exports = mongoose.model("Allocation",allocationSchema);