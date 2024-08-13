import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";




const registerrUser = asyncHandler (async (req,res,next)=>{
    // res.status(200).json({
    //     message: "Satya loves Shubha"
    // })

    //take data from user from frontend
    //validation -> not empty any field
    //check if already exist or not:through email,username
    //check for image,avatar
    //upload them  to cloudinary,check avatar
    //create user object (bcoz nosql takes object)-create entry in db
    //remove password and refresh token field
    //check for user creation successfully 
    //return response

      //validation

   //single check
//    if (fullname==""){
//     throw new ApiError(400,"fullname is required")

//    }
try {
   const {username,email,fullname,password}= req.body ; //destructure the data given by user
   //console.log("Received Data:", { username, email, fullname, password });



    if(  //checking all at a time
        [fullname,email,username,password].some((field)=>
            field?.trim()==="")
    ){
        throw new ApiError(400,"All fills are required")
    }

    const existedUser = await User.findOne({
        $or:[{username} , {email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with same email and user already exits")
    }

//file upload
const avatarLocalPath = req.files?.avatar?.[0]?.path;
let coverimageLocalPath;
if (req.files?.coverImage?.length > 0) {
    coverimageLocalPath = req.files.coverImage[0].path;
}

    if(!avatarLocalPath){
       // console.error("Avatar file is missing in the request.");
        throw new ApiError(400,"Avtar file is required")
    }

     // Uploading to Cloudinary
    // console.log("Uploading avatar to Cloudinary:", avatarLocalPath);
     const avatar = await uploadOnCloudinary(avatarLocalPath);
    // console.log("Avatar uploaded successfully:", avatar);

     const coverImage = coverimageLocalPath ? await uploadOnCloudinary(coverimageLocalPath) : null;
     //console.log("Cover image uploaded successfully:", coverImage);

    const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase(),
    })

    const createdUser=await User.findById(user._id)
    .select("-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user")    }


    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully.")
   )

}catch(error){
    //console.error("Error in registerUser controller:", error);
        next(error);
}
} )


export {registerrUser}