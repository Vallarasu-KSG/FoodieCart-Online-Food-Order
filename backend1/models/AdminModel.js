import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { minimize: false });

const AdminModel = mongoose.models.admin || mongoose.model("Admin", userSchema);
export default AdminModel;