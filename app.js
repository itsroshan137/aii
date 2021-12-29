const express = require("express");
const app = express();

const portNumber = process.env.PORT || 5000;

const mongodb = require("mongodb");
const connStringURL = "mongodb+srv://root:2pblv5xzwlIGe0ZU@sudentinfo.0ln56.mongodb.net/";
const mongodbClient = mongodb.MongoClient;

app.listen(portNumber, ()=>{
    console.log("App is listening on Port: ", portNumber);
})

app.get("/", (request, response) => {
    return response.status(200).send("<h2>We are Live...</h2>");
});

//inserting News Data to Database
app.post("/insertNewsData", (request, response) => {
    const newsData = {
        title : request.query.title,
        newsportal : request.query.newsportal,
        body: request.query.body,
        urlLink: request.query.urlLink   
    }

    mongodbClient.connect(connStringURL, { useUnifiedTopology: true }, (error, database)=>{
        if(error) return response.status(500).json({status: 500, error: error})

        //connecting to db
        const dbobj = database.db("covid19");
        dbobj.collection("newsdata").insertOne(newsData, { useUnifiedTopology: true }, (err, result) => {
            if(err) return response.status(500).json({ status: 500, err: err});
            database.close();
            return response.status(200).json({status:200, result: `${newsData.title} has been added..`})
        })
    })
})

