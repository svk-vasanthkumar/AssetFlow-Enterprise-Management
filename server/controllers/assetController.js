const Asset=require("../models/Asset");
const generateAssetTag=require("../utils/generateAssetTag");

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

module.exports={

createAsset

};