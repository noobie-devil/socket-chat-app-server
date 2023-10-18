import mongoose from "mongoose";
import globalConfig from "../utils/global.config.js";

mongoose.set('strictQuery', true)
mongoose.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.__v;
    }
});
mongoose.set('toObject', {
    transform: function(doc, ret) {
        delete ret.__v;
    }
});


const connectDb = async() => {
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDb');
    })
    await mongoose.connect(globalConfig.MONGODB.URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    })
}

export default connectDb
