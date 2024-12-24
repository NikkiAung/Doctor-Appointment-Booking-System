import mongoose from "mongoose";

const connectDB = async () => {
    //reacts connection
    mongoose.connection.on('connected', ()=>console.log('DB connected'));
    //emits connection
    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)
}

export default connectDB