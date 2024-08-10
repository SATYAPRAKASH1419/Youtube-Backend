import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

//configure
app.use(express.json({limit: "16kb"})) //middlewire max limit
app.use(express.urlencoded({extended:true,limit:"16kb"}))//url ka configuration "+", ya %20 type
app.use(express.static("public")) //allow user or public to access some images or favicon type thinsgs
app.use(cookieParser()) //acces user's browser cookies (read and set)


export {app}