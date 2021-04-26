import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";


dotenv.config({ path: './config.env' });

if(!process.env.DATABASE_URI) {
    process.exit();
}

const DB = process.env.DATABASE_URI!;

mongoose.connect(DB , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then( () => {
    console.log('DB connection successfull')
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>{
    console.log(`Listening to port ${PORT}...`)
});
