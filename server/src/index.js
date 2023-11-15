import express from "express";
import fs from "fs/promises"; // tiedostojen luku modeli
import cors from "cors";
const app = express();

// Notes tiedoston
const file = "db.json";

app.use(express.json(), cors());

// Lukee tiedoston
const readFile = async (filename) => {
  const rawData = await fs.readFile(filename, "utf-8");
  const jsonData = JSON.parse(rawData);
  return jsonData;
};
// tallentaa tiedostoon
const saveDataToFile = async (filename, data) => {
  const jsonData = JSON.stringify(data, null, 2);
  await fs.writeFile(filename, jsonData, "utf-8");
};

// items
let items = await readFile(file);

// Post
app.post("/api/items", (request, response) => {
  const body = request.body;

  if (!body.name || !body.count) {
    return response.status(400).json({
      error: "name or count missing",
    });
  }

  const newItem = {
    name: body.name,
    count: body.count,
    id: body.id,
  };

  items.items = items.items.concat(newItem);

  saveDataToFile(file, items);

  response.json(newItem);
});

// Delete
app.delete('/api/items/:id', (request, response) => {
  const id = Number(request.params.id)

  items.items = items.items.filter((item) => item.id !== id);

  saveDataToFile(file, items);

  response.status(204).end()
})

// Get
app.get("/", (request, response) => {
  response.send("<p>Server is running </p>");
});

app.get("/api/items", (request, response) => {
  response.json(items.items);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
