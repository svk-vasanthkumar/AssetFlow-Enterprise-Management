const mongoose=require("mongoose");

const assetSchema=new mongoose.Schema({

assetTag:{
type:String,
unique:true
},

name:{
type:String,
required:true
},

category:{
type:mongoose.Schema.Types.ObjectId,
ref:"AssetCategory"
},

serialNumber:{
type:String,
unique:true
},

acquisitionDate:Date,

acquisitionCost:Number,

condition:{
type:String,
enum:["Excellent","Good","Fair","Damaged"],
default:"Good"
},

location:String,

status:{
type:String,
enum:[
"Available",
"Allocated",
"Reserved",
"Under Maintenance",
"Lost",
"Retired",
"Disposed"
],
default:"Available"
},

sharedBookable:{
type:Boolean,
default:false
},

assignedTo:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
default:null
},

allocationHistory:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"Allocation"
}
],

maintenanceHistory:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"Maintenance"
}
]

},
{timestamps:true});

module.exports=mongoose.model("Asset",assetSchema);