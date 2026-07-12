const mongoose = require("mongoose");

const assetCategorySchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    description:{
        type:String,
        default:""
    },

    warrantyMonths:{
        type:Number,
        default:12
    },

    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    }

},
{timestamps:true}
);

module.exports = mongoose.model("AssetCategory",assetCategorySchema);