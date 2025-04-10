import express from "express";
import cors from "cors";
import { connectDB } from './db.js'
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";


const PORT = process.env.PORT || 4000

const app = express();
app.use(express.json())
app.use(cors());
await connectDB();
 
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

app.get("/", (req, res) => {
    res.send("Hello this is backend")
})


app.listen(PORT, () => {
    console.log("APp is listening on Port 4000")
});