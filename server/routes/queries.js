import express from "express";
import db from "../db/connection.js"

const router = express.Router();

//Gets the full order summary of the given customer
router.get("/custOrders/:id", async(req, res)=>{
    try{
        let query =[
            {$match: {CustID: req.params.id}},
            {
                $lookup: {
                    from: "customers",
                    localField: "CustID",
                    foreignField: "CustID",
                    as: "Customer"
                }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "Books",
                    foreignField: "BookID",
                    as: "BookDetails"
                },
            },
            {
                $unwind: {
                    path: "$Customer",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    OrderID: 1,
                    Date: 1,
                    TotalPrice: 1,
                    Customer: {
                        CustID: "$Customer.CustID",
                        Name: "$Customer.Name",
                        Phone: "$Customer.Phone"
                    },
                    BookDetails: 1
                }
            }
        ];

        let results = await db.collection("orders").aggregate(query).toArray();
        res.status(200).send(results);
    }
    catch(err){
        res.status(500).send('Error fulfilling query.');
    }
});

//Gets the performance review of the given book
router.get("/bookPerf/:id", async(req, res)=>{
    try{
        let query =[
            {$match: {BookID: req.params.id}},
            {
                $lookup: {
                    from: "reviews",
                    localField: "BookID",
                    foreignField: "BookID",
                    as: "ReviewDetails"
                }
            },
            {
                $lookup:{
                    from: "orders",
                    localField: "BookID",
                    foreignField: "Books",
                    as: "OrderDetails"
                }
            },
            {
                $lookup:{
                    from: "authors",
                    localField: "AuthID",
                    foreignField: "AuthID",
                    as: "Author"
                }
            },
            {
                $unwind: {
                    path: "$Author",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    Title: 1,
                    Genre: 1,
                    ISBN: 1,
                    Price: 1,
                    Author: {
                        FirstName: "$Author.FirstName",
                        LastName: "$Author.LastName"
                    },
                    ReviewDetails: 1,
                    OrderDetails: 1,
                    totalReviews: {$size: "$ReviewDetails"},
                    avgRating: {$avg: "$ReviewDetails.Rating"},
                    totalOrders: {$size: "$OrderDetails"}
                }
            }
        ];

        let results = await db.collection("books").aggregate(query).toArray();
        res.status(200).send(results);
    }
    catch(err){
        res.status(500).send('Error fulfilling query.');
    }
});

//Gets the books published by the given publishing house and the authors of those books
router.get("/pubInfo/:id", async(req, res)=>{
    try{
        let query =[
            {$match: {PubID: req.params.id}},
            {
                $lookup: {
                    from: "books",
                    localField: "PubID",
                    foreignField: "PubID",
                    as: "Books"
                }
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "Books.AuthID",
                    foreignField: "AuthID",
                    as: "Authors"
                }
            },
            {
                $project: {
                    PublishingHouse: 1,
                    City: 1,
                    State: 1,
                    Country: 1,
                    YearEstablished: 1,
                    MarketingSpend: 1,
                    Books: 1,
                    Authors: 1
                }
            }
        ];

        let results = await db.collection("publishers").aggregate(query).toArray();
        res.status(200).send(results);
    }
    catch(err){
        res.status(500).send('Error fulfilling query.');
    }
});


export default router