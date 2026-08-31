import express from "express";
import db from "../db/connection.js"
import { ObjectId } from "mongodb";

const booksRouter = express.Router();

//Get all books (R)
booksRouter.get("/", async(req, res) => {
    let collection = await db.collection("books");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
});

//Get a single book (R)
booksRouter.get("/:id", async(req, res) =>{
    let collection = await db.collection("books");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if(!result){
        res.status(404).send("Book not found.")
    }
    else{
        res.status(200).send(result);
    }
});

//Creates a new book (C)
booksRouter.post("/", async(req, res) =>{
    try{
        let newDoc = {
            BookID: req.body.BookID,
            Title: req.body.Title,
            AuthID: req.body.AuthID,
            Genre: req.body.Genre,
            ISBN: req.body.ISBN,
            Format: req.body.Format,
            Pages: req.body.Pages,
            Price: req.body.Price,
            PubID: req.body.PubID,
            Cover: req.body.Cover
        };

        let collection = await db.collection("books");
        let result = await collection.insertOne(newDoc);
        res.status(201).send(result);
    }
    catch(err){
        res.status(500).send("Error adding book.");
    }
});

//Updates a book's info (U)
booksRouter.patch("/:id", async(req, res) =>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        const updates = {
            $set:{
                BookID: req.body.BookID,
                Title: req.body.Title,
                AuthID: req.body.AuthID,
                Genre: req.body.Genre,
                ISBN: req.body.ISBN,
                Format: req.body.Format,
                Pages: req.body.Pages,
                Price: req.body.Price,
                PubID: req.body.PubID,
                Cover: req.body.Cover
            }
        };

        let collection = await db.collection("books");
        let result = await collection.updateOne(query, updates);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error updating book information.");
    }
});

//Deletes a book (D)
booksRouter.delete("/:id", async(req, res)=>{
    try{
        const query = {_id: new ObjectId(req.params.id)};
        let collection = await db.collection("books");
        let result = await collection.deleteOne(query);
        res.status(200).send(result);
    }
    catch(err){
        res.status(500).send("Error deleting book.")
    }
});

export default booksRouter;