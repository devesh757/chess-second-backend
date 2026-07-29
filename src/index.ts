import dotenv from "dotenv"
dotenv.config();
import express from 'express'
import cors  from "cors"
import mongoose from "mongoose"
import user from "./Routes/auth"


const app = express();

const mongourl = process.env.MONGO_URL as string;
const Port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth",user);


async function main(){
    await mongoose.connect(mongourl)
    app.listen(Port,() => console.log(`server running on port${Port}`))
}

main();