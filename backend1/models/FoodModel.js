import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true
        },
        image:
        {
            type:String,
            required:true
        },
        price:
        {
            type:Number,
            required:true
        },
        offerPrice:
        {
            type:Number,
            required:true
        },
        category:
        {
            type:String,
            required:true
        },
        address:
        {
            type:String,
            required:true
        }
    }
)

const FoodModel = mongoose.model.food || mongoose.model("food",FoodSchema);

export default FoodModel;