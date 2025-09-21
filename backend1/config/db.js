import mongoose from "mongoose";

export const mongoDB = async () => {
  await mongoose.connect('mongodb+srv://kvallarasu2003:Ammaakka%4016@cluster0.izndm.mongodb.net/food-order-database?retryWrites=true&w=majority&appName=Cluster0')
  .then(()=>console.log("MongoDB is Connected"));
}