require("dotenv").config()
const express = require("express");
const app = express();
app.use(express.json())
const router = require("./routes")
const { connectToMongoDB } = require("./database")
const path = require("path")

const port = process.env.PORT || 5000;

app.use(express.json())
app.use("/api", router)
app.use(express.static(path.join(__dirname, "build")))
app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "build/index.html"))
})
async function startServer() {
    await connectToMongoDB()
    app.listen(port, ()=>{
        console.log(`Server is listening on http://localhost:${port}`);  
    })
}

startServer()
