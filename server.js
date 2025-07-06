/********************************************************************************
*  WEB700 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: __Fatima Noor____________________ Student ID: ___189057235___________ Date: _13/6/25_____________
*
*  Published URL: ____https://web-700-assignment-3-qf780zja1-fatima-noors-projects.vercel.app
********************************************************************************/

const express = require("express");
const path = require("path");

const LegoData = require("./modules/legoSets");
const legoData = new LegoData();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware to serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON body in POST requests
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/lego/sets", async (req, res) => {
  try {
    const theme = req.query.theme;

    if (theme) {
      const sets = await legoData.getSetsByTheme(theme);
      res.json(sets);
    } else {
      const sets = await legoData.getAllSets();
      res.json(sets);
    }
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

app.get("/lego/sets/:set_num", async (req, res) => {
  try {
    const setNum = req.params.set_num;
    const set = await legoData.getSetByNum(setNum);
    res.json(set);
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

// New POST route to add a Lego set
app.post("/lego/sets", async (req, res) => {
  try {
    const newSet = req.body;
    await legoData.addSet(newSet);
    res.status(201).json({ message: "Set added successfully" });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

// 404 handler for any other routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

legoData.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server is listening on port ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
  });
