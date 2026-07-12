const Maintenance=require("../models/Maintenance");
const Asset=require("../models/Asset");

// Raise Request
const raiseRequest=async(req,res)=>{
try{
const { asset: assetId }=req.body;

// 1. Validate asset exists
const asset=await Asset.findById(assetId);
if(!asset){
return res.status(404).json({
success:false,
message:"Asset not found"
});
}

// 2. Prevent maintenance for unavailable asset states
const restrictedStatuses=["Under Maintenance","Lost","Retired","Disposed"];
if(restrictedStatuses.includes(asset.status)){
return res.status(400).json({
success:false,
message:`Cannot request maintenance. Asset is currently ${asset.status}`
});
}

const maintenance=await Maintenance.create(req.body);
res.status(201).json({
success:true,
maintenance
});
}catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
};

// Approve Request
const approveRequest=async(req,res)=>{
try{
const maintenance=await Maintenance.findById(req.params.id);
if(!maintenance){
return res.status(404).json({
success:false,
message:"Maintenance request not found"
});
}

// 1. Verify it is still pending
if(maintenance.status!=="Pending"){
return res.status(400).json({
success:false,
message:`Request cannot be approved. Current status is: ${maintenance.status}`
});
}

// 2. Update maintenance record with status and stamp
maintenance.status="Approved";
maintenance.approvedDate=new Date(); // Judge improvement tracking
await maintenance.save();

// 3. Update asset status and log to history
const asset=await Asset.findById(maintenance.asset);
if(asset){
asset.status="Under Maintenance";
asset.maintenanceHistory.push(maintenance._id);
await asset.save();
}

res.json({
success:true,
message:"Maintenance Approved"
});
}catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
};

// Resolve Request
const resolveRequest=async(req,res)=>{
try{
const maintenance=await Maintenance.findById(req.params.id);
if(!maintenance){
return res.status(404).json({
success:false,
message:"Maintenance request not found"
});
}

// 1. Verify it's approved before resolving
if(maintenance.status!=="Approved"){
return res.status(400).json({
success:false,
message:`Only approved requests can be resolved. Current status is: ${maintenance.status}`
});
}

// 2. Update maintenance record with resolution stamp
maintenance.status="Resolved";
maintenance.resolvedDate=new Date(); // Judge improvement tracking
await maintenance.save();

// 3. Make asset available again
const asset=await Asset.findById(maintenance.asset);
if(asset){
asset.status="Available";
await asset.save();
}

res.json({
success:true,
message:"Maintenance Completed"
});
}catch(err){
res.status(500).json({
success:false,
message:err.message
});
}
};

module.exports={
raiseRequest,
approveRequest,
resolveRequest
};