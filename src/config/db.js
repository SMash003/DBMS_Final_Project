import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient({
    log: process.env.NODE_ENV ==="development" ?
    ["query","error", "warn"]
    :["error"]
});

const connectDB =async()=>{
    try{
        await prisma.$connect();
        console.log("db connected through prisma")
    }catch(error){
        console.error("Unable to connect with db due to an error",error.message);
        process.exit(1);
    }
}

const disconnectDB = async()=>{
    await prisma.$disconnect();
}

export {prisma, connectDB, disconnectDB};