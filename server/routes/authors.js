import express from "express";
import db from "../db/connection.js"
import { ObjectId } from "mongodb";

const authorsRouter = express.Router();

//Get all authors (R)
authorsRouter.get("/", async(req, res) => {
    let collection = await db.collection("authors");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
});

//Get a single author (R)
authorsRouter.get("/:id", async(req, res) =>{
    let collection = await db.collection("authors");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if(!result){
        res.status(404).send("Author not found.")
    }
    else{
        res.status(200).send(result);
    }
});

//Creates a new author (C)
authorsRouter.post("/", async(req, res) =>{
    try{
        let newDoc = {
            AuthID: req.body.AuthID,
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Residence: req.body.Residence
        };

        let collection = await db.collection("authors");
        let result = await collection.insertOne(newDoc);
        res.status(201).send(result);
    }
    catch(err){
        res.status(500).send("Error adding author.");
    }
});

//Updates a author's info (U)
authorsRouter.patch("/:id", async(req, res) =>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        const updates = {
            $set:{
                AuthID: req.body.AuthID,
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Residence: req.body.Residence
            }
        };

        let collection = await db.collection("authors");
        let result = await collection.updateOne(query, updates);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error updating author information.");
    }
});

//Deletes a author (D)
authorsRouter.delete("/:id", async(req, res)=>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        let collection = await db.collection("authors");
        let result = await collection.deleteOne(query);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error deleting author.")
    }
});

export default authorsRouter;