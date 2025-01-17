const express=require("express")
const {getSlug,Search,DeleteSlug,update}=require("../controller/controller.js")
const router=express.Router();

router.post("/getSlug",getSlug);
router.post("/search",Search);
router.delete("/delete",DeleteSlug);
router.patch("/update",update);

module.exports=router;



