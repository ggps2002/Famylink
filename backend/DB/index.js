import mongoose from "mongoose";
import 'dotenv/config'

mongoose.connect(process.env.MONGO_DB_URI);

export default mongoose;