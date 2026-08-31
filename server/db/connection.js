import pkg from "mongodb";
import "dotenv/config"
const { MongoClient, ServerApiVersion } = pkg;

const uri = process.env.ATLAS_URI || "";

if(!uri){
    throw new Error("ATLAS)URI could not be found.");
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

try{
    await client.connect();
    await client.db("admin").command({ping:1});
    console.log("You've pinged a thing!");
}
catch(err){
    console.log(err)
}

let db = client.db("bookstore");
export default db;