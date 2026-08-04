import {prisma} from "../config/db.js";
import bcrypt from "bcryptjs";

 // Creating User
export const registerUser = async (req, res) => {
  try {
    const { username, password, email, role, officerId } = req.body;
    
    const userExist = await prisma.user.findUnique({
        where: {email: email}
    });
    if(userExist){
        return res.status(400).json({error: "User already exist"});
    }

    //hash password 
    //it requir npm i bcryptjs for pass saving 
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt)//hash take 2 value 1 is user pass another is salt value

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        email,
        role,
        officerId,
      },
      include: {
        officer: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create user.",
      error: error.message,
    });
  }
};

//login user
export const login = async(req,res)=>{
    const {email, password}= req.body;

    //check if user exist
    const user = await prisma.user.findUnique({
        where: {email: email}
    });
    if(!user){
        return res.status(401).json({error: "Invalid User or password"});
    }
    //compare function compares plain users password with bcryped password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if(!isPasswordValid){
        return res.status(401).json({error: "Invalid User or password"});
    }
    
    res.status(201).json({
        status: "success login",
        data:{
            user:{
                id: user.id,
                email: email,
            },
        }
    });
};


//get user profile by using ID
export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        officer: {
          include: {
            station: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user.",
      error: error.message,
    });
  }
};

//updating user info
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, passwordHash, email, role, officerId } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
        passwordHash,
        email,
        role,
        officerId,
      },
      include: {
        officer: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user.",
      error: error.message,
    });
  }
};

//deleting user
export const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
      error: error.message,
    });
  }
};