import express from "express";
import db from "../db/connection.js"
import { ObjectId } from "mongodb";

const publishersRouter = express.Router();

//Get all publishers (R)
publishersRouter.get("/", async(req, res) => {
    let collection = await db.collection("publishers");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
});

//Get a single publisher (R)
publishersRouter.get("/:id", async(req, res) =>{
    let collection = await db.collection("publishers");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if(!result){
        res.status(404).send("Publisher not found.")
    }
    else{
        res.status(200).send(result);
    }
});

//Creates a new publisher (C)
publishersRouter.post("/", async(req, res) =>{
    try{
        let newDoc = {
            PubID: req.body.PubID,
            PublishingHouse: req.body.PublishingHouse,
            City: req.body.City,
            State: req.body.State,
            Country: req.body.Country,
            YearEstablished: req.body.YearEstablished,
            MarketingSpend: req.body.MarketingSpend
        };

        let collection = await db.collection("publishers");
        let result = await collection.insertOne(newDoc);
        res.status(201).send(result);
    }
    catch(err){
        res.status(500).send("Error adding publisher.");
    }
});

//Updates a publisher's info (U)
publishersRouter.patch("/:id", async(req, res) =>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        const updates = {
            $set:{
                PubID: req.body.PubID,
                PublishingHouse: req.body.PublishingHouse,
                City: req.body.City,
                State: req.body.State,
                Country: req.body.Country,
                YearEstablished: req.body.YearEstablished,
                MarketingSpend: req.body.MarketingSpend
            }
        };

        let collection = await db.collection("publishers");
        let result = await collection.updateOne(query, updates);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error updating publisher information.");
    }
});

//Deletes a publisher (D)
publishersRouter.delete("/:id", async(req, res)=>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        let collection = await db.collection("publishers");
        let result = await collection.deleteOne(query);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error deleting publisher.")
    }
});

export default publishersRouter;