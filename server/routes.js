const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
  const client = getConnectedClient();
  const collection = client.db("todosdb").collection("todos");
  return collection;
};

// get /todos
router.get("/todos", async (req, res) => {
  const collection = getCollection();
  const todos = await collection.find({}).toArray();
  res.status(200).json(todos);
});

// post /todos
router.post("/todos", async (req, res) => {
  const collection = getCollection();
  let { todo } = req.body;

  if (!todo) {
    return res.status(400).json({ message: "Error no todo find" });
  }
  todo = (typeof todo === "string") ? todo : JSON.stringify(todo);
  const newtodo = await collection.insertOne({ todo, status: false });

  res.status(201).json({ todo, status: false, _id: newtodo.insertedId });
});

// delete /todos/:id
router.delete("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);
  const deletetodo = await collection.deleteOne({ _id });
  res.status(200).json(deletetodo);
});

// put /todos/:id
router.put("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);
  const { status } = req.body;
  if (typeof status !== "boolean") {
    return res.status(400).json({ message: "invalid status" });
  }
  const updatedtodo = await collection.updateOne(
    { _id },
    { $set: { status: !status } }
  );
  res.status(200).json(updatedtodo);
});

module.exports = router;
