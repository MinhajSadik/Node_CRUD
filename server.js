const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const path = require("path");
const { MongoClient } = require("mongodb");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 1357;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connection URL from ./DB/DBManager.js
// DBConnection();

const DB_URI = process.env.DB_URL;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const client = new MongoClient(DB_URI, options);
client.connect((err) => {
  const collection = client.db("Node_CRUD").collection("products");

  //loadAllProducts
  app.get("/products", (req, res) => {
    collection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  //loadProductForUpdate
  app.get("/product/:id", (req, res) => {
    collection.find({ _id: ObjectId(req.params.id) }).toArray((err, docs) => {
      res.send(docs[0]);
    });
  });

  //addProduct
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    collection.insertOne(product, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log("result", result.insertedId);
        res.redirect("/");
      }
    });
  });

  //deleteProduct
  app.delete("/delete/:id", (req, res) => {
    const ID = req.params.id;
    collection.deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log("result", result);
        res.send(result.deletedCount > 0);
      }
    });
  });

  //updateProduct
  app.patch("/update/:id", (req, res) => {
    collection.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: {
          name: req.body.name,
          age: req.body.age,
          height: req.body.height,
        },
      },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("result", result);
          res.redirect("/");
        }
      }
    );
  });
  console.log("Database Connected...");
});

// const __dirname = path.resolve();

//send html file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
  console.log(`Server running on Port ${PORT}`);
});
