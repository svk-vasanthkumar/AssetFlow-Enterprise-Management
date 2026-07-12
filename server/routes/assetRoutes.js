const express=require("express");
const router=express.Router();
const{
createAsset,
allocateAsset,
returnAsset
}=require("../controllers/assetController");

router.post("/",createAsset);
router.post("/allocate",allocateAsset);
router.post("/return",returnAsset);

module.exports=router;