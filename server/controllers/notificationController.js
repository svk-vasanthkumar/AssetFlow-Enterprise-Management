const Notification=require("../models/Notification");

// Create
const createNotification=async(req,res)=>{

try{

const notification=await Notification.create(req.body);

res.status(201).json({

success:true,

notification

});

}catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

}

// Get

const getNotifications=async(req,res)=>{

try{

const notifications=await Notification.find()

.populate("user","name email")

.sort({createdAt:-1});

res.json({

success:true,

notifications

});

}catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

}

// Mark Read

const markAsRead=async(req,res)=>{

try{

const notification=await Notification.findById(req.params.id);

notification.isRead=true;

await notification.save();

res.json({

success:true,

message:"Notification marked as read"

});

}catch(err){

res.status(500).json({

success:false,

message:err.message

});

}

}

module.exports={

createNotification,

getNotifications,

markAsRead

}