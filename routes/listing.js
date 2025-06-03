const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingControler=require("../controler/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
//index route
 .get(wrapAsync(listingControler.index))
 //create route
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingControler.createListings));

 //new route
router.get("/new",isLoggedIn,listingControler.renderNewForm);

 router.route("/:id")
 //show route
   .get(wrapAsync(listingControler.showListing))
   //update route
   .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingControler.updateListings))
   //delete route
   .delete(isLoggedIn,isOwner,wrapAsync(listingControler.deleteListings));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControler.renderEditForm));


module.exports=router;