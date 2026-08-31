import express from "express";
import db from "../db/connection.js"

const router = express.Router();

router.get("/genreNum", async(req, res)=>{
    try{
        let query =[
            {
                $group: {
                    _id: "$Genre",
                    count: {$sum: 1}
                }
            },
            {$sort: {count: -1}}
        ];

        let results = await db.collection("books").aggregate(query).toArray();

        const format = results.map(item => ({
            label: item._id, 
            value: item.count
        }))

        res.status(200).send(format);
    }
    catch(err){
        res.status(500).send('Error fulfilling query.');
    }
});

router.get("/genreSales", async(req, res)=>{
    try{
        let query =[
            { $lookup: {
                    from: "books",
                    localField: "Books",
                    foreignField: "BookID",
                    as: "book"
                }
            },
            {$unwind: "$book"},
            {
                $group: {
                    _id: "$book.Genre",
                    count: {$sum: 1}
                }
            },
            {$sort: {count: -1}}
        ];

        let results = await db.collection("orders").aggregate(query).toArray();

        const format = results.map(item => ({
            label: item._id, 
            value: item.count
        }))

        res.status(200).send(format);
    }
    catch(err){
        res.status(500).send('Error fulfilling query.');
    }
});

router.get("/authorReviews", async(req, res)=>{
    try{
        let query =[
            { 
                $lookup: {
                    from: "books",
                    localField: "BookID",
                    foreignField: "BookID",
                    as: "book"
                }
            },
            {$unwind: "$book"},
            {
                $group: {
                    _id: "$book.AuthID",
                    avgRating: {$avg: "$Rating"}
                }
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "_id",
                    foreignField: "AuthID",
                    as: "author"
                }
            },
            {$unwind: "$author"},
            {
                $project: {
                    authorFirstName: "$author.FirstName",
                    authorLastName: "$author.LastName",
                    avgRating: 1
                }
            },
            {$sort: {avgRating: -1}}
        ];

        let results = await db.collection("reviews").aggregate(query).toArray();

        const format = results.map(item => ({
            label: `${item.authorFirstName} ${item.authorLastName}`, 
            value: item.avgRating
        }))

        res.status(200).send(format);
    }
    catch(err){
        res.status(500).send('Error fulfilling query.');
    }
});

router.get("/authorSales", async(req, res)=>{
    try{
        let query =[
            {$unwind: "$Books"},
            { 
                $lookup: {
                    from: "books",
                    localField: "Books",
                    foreignField: "BookID",
                    as: "book"
                }
            },
            {$unwind: "$book"},
            {
                $group: {
                    _id: "$book.AuthID",
                    count: {$sum: 1}
                }
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "_id",
                    foreignField: "AuthID",
                    as: "author"
                }
            },
            {$unwind: "$author"},
            {
                $project: {
                    authorFirstName: "$author.FirstName",
                    authorLastName: "$author.LastName",
                    count: 1
                }
            },
            {$sort: {count: -1}}
        ];

        let results = await db.collection("orders").aggregate(query).toArray();

        const format = results.map(item => ({
            label: `${item.authorFirstName} ${item.authorLastName}`, 
            value: item.count
        }))

        res.status(200).send(format);
    }
    catch(err){
        res.status(500).send('Error fulfilling query.');
    }
});

router.get("/top5BookSales", async(req, res)=>{
    try{
        let query =[
            { $lookup: {
                    from: "books",
                    localField: "Books",
                    foreignField: "BookID",
                    as: "book"
                }
            },
            {$unwind: "$book"},
            {
                $group: {
                    _id: "$book.BookID",
                    Count: {$sum: 1},
                    Title: {$first: "$book.Title"},
                    Cover: {$first: "$book.Cover"},
                    AuthID: {$first: "$book.AuthID"},
                    Genre: {$first: "$book.Genre"},
                    Price: {$first: "$book.Price"}
                }
            },
            {$sort: {Count: -1}}
        ];

        let results = (await db.collection("orders").aggregate(query).toArray()).slice(0, 5);

        res.status(200).send(results);
    }
    catch(err){
        res.status(500).send('Error fulfilling query.');
    }
});

router.get("/top5BookReviews", async(req, res)=>{
    try{
        let query =[
            { $lookup: {
                    from: "books",
                    localField: "BookID",
                    foreignField: "BookID",
                    as: "book"
                }
            },
            {$unwind: "$book"},
            {
                $group: {
                    _id: "$book.BookID",
                    AvgRating: {$avg: "$Rating"},
                    Title: {$first: "$book.Title"},
                    Cover: {$first: "$book.Cover"},
                    AuthID: {$first: "$book.AuthID"},
                    Genre: {$first: "$book.Genre"},
                    Price: {$first: "$book.Price"}
                }
            },
            {$sort: {AvgRating: -1}}
        ];

        let results = (await db.collection("reviews").aggregate(query).toArray()).slice(0, 5);

        res.status(200).send(results);
    }
    catch(err){
        res.status(500).send('Error fulfilling query.');
    }
});

export default router;