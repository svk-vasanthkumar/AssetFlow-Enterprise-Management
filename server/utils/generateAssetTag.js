const Asset=require("../models/Asset");

const generateAssetTag=async()=>{

const count=await Asset.countDocuments();

const next=count+1;

return `AF-${String(next).padStart(4,"0")}`;

}

module.exports=generateAssetTag;