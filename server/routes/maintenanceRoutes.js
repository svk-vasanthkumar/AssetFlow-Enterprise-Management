const express=require("express");
const router=express.Router();
const{
raiseRequest,
approveRequest,
resolveRequest
}=require("../controllers/maintenanceController");

router.post("/",raiseRequest);
router.put("/approve/:id",approveRequest);
router.put("/resolve/:id",resolveRequest);

module.exports=router;