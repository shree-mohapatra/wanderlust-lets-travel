const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
  const allListings=await Listing.find({});
  res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{
   res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id)
  .populate({path:"reviews",
    populate:{
    path:"author",
  },
})
 .populate("owner");
   if(!listing){
    req.flash("error","Listing Not Found!");
    return res.redirect("/listings");
   }
  res.render("listings/show.ejs",{listing});
};

module.exports.createListings=async(req,res,next)=>{
  let resp=await geocodingClient.forwardGeocode({
  query:req.body.listing.location,
  limit: 1,
})
  .send();

let url=req.file.path;
 let filename=req.file.filename;
 const newListing= new Listing(req.body.listing);
 newListing.owner=req.user._id;
 newListing.image={url,filename};

 newListing.geometry=resp.body.features[0].geometry;

let saved=await newListing.save();
console.log(saved);
 req.flash("success","New Listing Created");
 res.redirect("/listings")
};

// module.exports.renderEditForm=async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   if (!listing) {
//     return res.status(404).send("Listing not found");
//   }
//   res .render("listings/edit", { listing });
// };  

module.exports.renderEditForm=async (req,res)=>{
   let {id}=req.params;
  const listing=await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing Not Found!");
    return res.redirect("/listings");
  }
  let originalimgUrl=listing.image.url;
  originalimgUrl=originalimgUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs",{listing,originalimgUrl});
};

module.exports.updateListings=async(req,res)=>{
  let {id}=req.params;
  let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file!=="undefined"){ 
  console.log(req.file);
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }
  req.flash("success","Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListings=async (req,res)=>{
  let {id}=req.params;
 let deleted= await Listing.findByIdAndDelete(id);
 req.flash("success","Listing Deleted!");
  res.redirect("/listings");
};