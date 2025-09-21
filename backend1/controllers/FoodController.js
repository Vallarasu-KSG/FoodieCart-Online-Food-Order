import FoodModel from "../models/FoodModel.js";
import fs from 'fs';

const addFood = async (req, res) => {

  let image_filename = req.file?.filename || "default_image.jpg";

  const food = new FoodModel({
    name: req.body.name,
    price: req.body.price,  
    offerPrice: req.body.offerPrice,
    category: req.body.category,
    address: req.body.address,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added", });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error", });
  }
};

// all food list
const listFood = async ( req, res ) => {
  try {
      const foods = await FoodModel.find({});
      res.json({success:true,data:foods})
  } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
  }
}

// food removed
const removeFood = async ( req, res ) => {
  try {
      const food = await FoodModel.findById(req.body.id);
      fs.unlink(`uploads/${food.image}`,()=>{})

      await FoodModel.findByIdAndDelete(req.body.id);
      res.json({success:true,message:"Food Removed"})
  } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
  }
}


export { addFood, listFood, removeFood };
