import express from "express";
import db from "../db/connection.js"
import { ObjectId } from "mongodb";

const ordersRouter = express.Router();

//Get all orders (R)
ordersRouter.get("/", async(req, res) => {
    let collection = await db.collection("orders");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
});

//Get a single order (R)
ordersRouter.get("/:id", async(req, res) =>{
    let collection = await db.collection("orders");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if(!result){
        res.status(404).send("Order not found.")
    }
    else{
        res.status(200).send(result);
    }
});

//Creates a new order (C)
ordersRouter.post("/", async(req, res) =>{
    try{
        const collection = db.collection("orders");
        const booksCollection = db.collection("books");

        const booksData = await booksCollection.find({ BookID: { $in: req.body.Books } }).toArray();

        const totalPrice = booksData.reduce((sum, b) => sum + b.Price, 0);

        let newDoc = {
            OrderID: req.body.OrderID,
            CustID: req.body.CustID,
            Date: req.body.Date,
            Books: req.body.Books,
            TotalPrice: totalPrice
        };

        let result = await collection.insertOne(newDoc);
        res.status(201).send(result);
    }
    catch(err){
        res.status(500).send("Error adding order.");
    }
});

//Updates a order's info (U)
ordersRouter.patch("/:id", async(req, res) =>{
    try{
        const collection = db.collection("orders");
        const booksCollection = db.collection("books");

        const booksData = await booksCollection.find({ BookID: { $in: req.body.Books } }).toArray();

        const totalPrice = booksData.reduce((sum, b) => sum + b.Price, 0);

        const query = {_id: new ObjectId(req.params.id)};
        const updates = {
            $set:{
                OrderID: req.body.OrderID,
                CustID: req.body.CustID,
                Date: req.body.Date,
                Books: req.body.Books,
                TotalPrice: totalPrice
            }
        };

        let result = await collection.updateOne(query, updates);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error updating order information.");
    }
});

//Deletes a order (D)
ordersRouter.delete("/:id", async(req, res)=>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        let collection = await db.collection("orders");
        let result = await collection.deleteOne(query);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error deleting order.")
    }
});

export default ordersRouter;