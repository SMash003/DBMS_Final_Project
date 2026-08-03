import {PrismaClient} from "@prisma/client";

//for deployment 
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV ==="development" ?
    ["query","error", "warn"]
    :["error"]
});

if (process.env.NODE_ENV !== "production"){{
    globalForPrisma.prisma = prisma;
}}

//no need during deployment

// const connectDB =async()=>{
//     try{
//         await prisma.$connect();
//         console.log("db connected through prisma")
//     }catch(error){
//         console.error("Unable to connect with db due to an error",error.message);
//         process.exit(1);
//     }
// }

// const disconnectDB = async()=>{
//     await prisma.$disconnect();
// }

// export {connectDB, disconnectDB};
export {prisma};