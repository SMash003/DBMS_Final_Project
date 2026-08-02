//this file is used to enter lots of data or initial data or demo data into data base
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

datas=[]
const main =async()=>{
    for(const data of datas){
        await prisma.officer.create(
            {
                data:data
            }
        )
        console.log("done putting ",data.firstName);
    }
    console.log("kam sesh");
}
main().
catch((err)=>{
    console.error(err);
    process.exit(1);
}).
finally(async()=>{
    await prisma.$disconnect();
});