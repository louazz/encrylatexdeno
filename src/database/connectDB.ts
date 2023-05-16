import {MongoClient} from "https://deno.land/x/mongo/mod.ts";

const client = new MongoClient()

await client.connect("mongodb+srv://doadmin:JaR1T76me29045XV@db-mongodb-fra1-11164-4de1e314.mongo.ondigitalocean.com/admin?authMechanism=SCRAM-SHA-1");


console.log("Databse connected");

const db = client.database("encrylatex")

export default db;