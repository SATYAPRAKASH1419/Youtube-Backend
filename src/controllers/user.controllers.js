import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";




const registerrUser = asyncHandler (async (req,res)=>{
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

    //step01
   const {username,email,fullname,password}= req.body ; //destructure the data given by user
   console.log("email: ",email);


   //validation

   //single check
//    if (fullname==""){
//     throw new ApiError(400,"fullname is required")

//    }

    if(  //checking all at a time
        [fullname,email,username,password].some((field)=>
            field?.trim()==="")
    ){
        throw new ApiError(400,"All fills are required")
    }

    const existedUser = User.findOne({
        $or:[{username} , {email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with same email and user already exits")
    }


    const avatarLocalPath= req.files?.avatar[0]?.path;
    const coverimageLocalPath= req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avtar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverimageLocalPath);
    
    if(!avatar){
        throw new ApiError(400,"Avtar file is required")
    }

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
} )


export {registerrUser}