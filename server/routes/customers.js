import express from "express";
import db from "../db/connection.js"
import { ObjectId } from "mongodb";

const customersRouter = express.Router();

//Get all customers (R)
customersRouter.get("/", async(req, res) => {
    let collection = await db.collection("customers");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
});

//Get a single customer (R)
customersRouter.get("/:id", async(req, res) =>{
    let collection = await db.collection("customers");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if(!result){
        res.status(404).send("Customer not found.")
    }
    else{
        res.status(200).send(result);
    }
});

//Creates a new customer (C)
customersRouter.post("/", async(req, res) =>{
    try{
        let newDoc = {
            CustID: req.body.CustID,
            Name: req.body.Name,
            Phone: req.body.Phone
        };

        let collection = await db.collection("customers");
        let result = await collection.insertOne(newDoc);
        res.status(201).send(result);
    }
    catch(err){
        res.status(500).send("Error adding customer.");
    }
});

//Updates a customer's info (U)
customersRouter.patch("/:id", async(req, res) =>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        const updates = {
            $set:{
                CustID: req.body.CustID,
                Name: req.body.Name,
                Phone: req.body.Phone
            }
        };

        let collection = await db.collection("customers");
        let result = await collection.updateOne(query, updates);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error updating customer information.");
    }
});

//Deletes a customer (D)
customersRouter.delete("/:id", async(req, res)=>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        let collection = await db.collection("customers");
        let result = await collection.deleteOne(query);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error deleting customer.")
    }
});

export default customersRouter;