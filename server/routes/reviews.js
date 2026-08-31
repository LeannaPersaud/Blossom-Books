import express from "express";
import db from "../db/connection.js"
import { ObjectId } from "mongodb";

const reviewsRouter = express.Router();

//Get all reviews (R)
reviewsRouter.get("/", async(req, res) => {
    let collection = await db.collection("reviews");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
});

//Get a single review (R)
reviewsRouter.get("/:id", async(req, res) =>{
    let collection = await db.collection("reviews");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if(!result){
        res.status(404).send("Review not found.")
    }
    else{
        res.status(200).send(result);
    }
});

//Creates a new review (C)
reviewsRouter.post("/", async(req, res) =>{
    try{
        let newDoc = {
            BookID: req.body.BookID,
            Rating: req.body.Rating,
            ReviewID: req.body.ReviewID,
            CustID: req.body.CustID
        };

        let collection = await db.collection("reviews");
        let result = await collection.insertOne(newDoc);
        res.status(201).send(result);
    }
    catch(err){
        res.status(500).send("Error adding review.");
    }
});

//Updates a review's info (U)
reviewsRouter.patch("/:id", async(req, res) =>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        const updates = {
            $set:{
                BookID: req.body.BookID,
                Rating: req.body.Rating,
                ReviewID: req.body.ReviewID,
                CustID: req.body.CustID
            }
        };

        let collection = await db.collection("reviews");
        let result = await collection.updateOne(query, updates);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error updating review information.");
    }
});

//Deletes a review (D)
reviewsRouter.delete("/:id", async(req, res)=>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        let collection = await db.collection("reviews");
        let result = await collection.deleteOne(query);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error deleting review.")
    }
});

export default reviewsRouter;