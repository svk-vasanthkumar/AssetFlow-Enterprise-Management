const Asset=require("../models/Asset");
const generateAssetTag=require("../utils/generateAssetTag");
const User=require("../models/User");
const Allocation=require("../models/Allocation");

const createAsset=async(req,res)=>{
try{
const assetTag=await generateAssetTag();
const asset=await Asset.create({
...req.body,
assetTag
});
res.status(201).json({
success:true,
asset
});
}catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
};

const allocateAsset=async(req,res)=>{
try{
const{
assetId,
employeeId,
expectedReturn
}=req.body;
const asset=await Asset.findById(assetId);
if(!asset){
return res.status(404).json({
success:false,
message:"Asset not found"
});
}
if(asset.status==="Allocated"){
return res.status(400).json({
success:false,
message:"Asset already allocated"
});
}
const allocation=await Allocation.create({
asset:assetId,
employee:employeeId,
expectedReturn
});
asset.status="Allocated";
asset.assignedTo=employeeId;
asset.allocationHistory.push(allocation._id);
await asset.save();
res.status(200).json({
success:true,
message:"Asset Allocated",
allocation
});
}catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
};

const returnAsset=async(req,res)=>{
try{
const{
allocationId,
conditionOnReturn
}=req.body;
const allocation=await Allocation.findById(allocationId);
if(!allocation){
return res.status(404).json({
success:false,
message:"Allocation not found"
});
}
allocation.status="Returned";
allocation.returnedDate=new Date();
allocation.conditionOnReturn=conditionOnReturn;
await allocation.save();
const asset=await Asset.findById(allocation.asset);
asset.status="Available";
asset.assignedTo=null;
await asset.save();
res.json({
success:true,
message:"Asset Returned"
});
}catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
};

module.exports={
createAsset,
allocateAsset,
returnAsset
};