import { asyncHandler } from "../utils/asyncHandler.js";


const registerrUser = asyncHandler (async (req,res)=>{
    res.status(200).json({
        message: "Satya loves Shubha"
    })
} )


export {registerrUser}