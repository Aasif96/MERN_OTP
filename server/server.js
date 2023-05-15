import dotenv from "dotenv";
dotenv.config();
import  express  from "express";
import cors from 'cors';
import morgan from "morgan";
import connectDB from "./db/connectdb.js";
import router from "./routes/route.js";
import { error } from "./middleware/error.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by') //less hacker know about stack
app.use('/api',router);

// Middleware for Errors
app.use(error);

app.get('/',(req,res)=>{
    res.status(201).json('home get request')
})

connectDB(process.env.URI).then(() => {
    try {
        app.listen(process.env.port,()=>{
            console.log(`server running at ${process.env.port}`)
        })

    } catch (error) {
        console.log('could not connect to server')
    }
})



