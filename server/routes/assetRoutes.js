const express=require("express");

const router=express.Router();

const{

createAsset

}=require("../controllers/assetController");

router.post("/",createAsset);

module.exports=router;