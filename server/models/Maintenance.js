const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
{
    asset:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Asset",
        required:true
    },

    raisedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    issue:{
        type:String,
        required:true
    },

    priority:{
        type:String,
        enum:["Low","Medium","High","Critical"],
        default:"Medium"
    },

    technician:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    status:{
        type:String,
        enum:[
            "Pending",
            "Approved",
            "Rejected",
            "In Progress",
            "Resolved"
        ],
        default:"Pending"
    }

},
{timestamps:true});

module.exports=mongoose.model("Maintenance",maintenanceSchema);