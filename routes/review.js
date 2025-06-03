const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const Review=require("../models/review.js");

const reviewControler=require("../controler/reviews.js");



//Reviews
//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControler.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControler.deleteReview));

module.exports=router;