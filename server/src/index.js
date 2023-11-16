import express from "express";
import fs from "fs/promises"; // tiedostojen luku modeli
import cors from "cors"; // Antaa palvelimen vastaanottaa pyyntöjä eri porteista
const app = express();

app.use(express.json(), cors());

// "Tietokanta" tiedosto
const file = "db.json";

// Tiedoston lukeminen
const readFile = async (filename) => {
  const rawData = await fs.readFile(filename, "utf-8");
  const jsonData = JSON.parse(rawData);
  return jsonData;
};
// tallentaa tiedostoon
const saveDataToFile = async (filename, data) => {
  const jsonData = JSON.stringify(data, null, 2); // Muunnetaan JSON muotoon
  await fs.writeFile(filename, jsonData, "utf-8");
};

// items
let items = await readFile(file);

// Post
app.post("/api/items", (request, response) => {
  const body = request.body;

  // Tarkistetaan, että post sisältää halutut asiat
  if (!body.name || !body.count) {
    return response.status(400).json({
      error: "name or count missing",
    });
  }

  // Objekti, joka lisätään tiedostoon.
  const newItem = {
    name: body.name,
    count: body.count,
    id: body.id,
  };

  // Lisätään data tiedostoon ja tallennetaan
  items.items = items.items.concat(newItem);
  saveDataToFile(file, items);
  response.json(newItem);
});

// Delete
app.delete("/api/items/:id", (request, response) => {
  // Otetaan ID parametreistä .../api/items/ID <-
  const id = Number(request.params.id);
  // Etsitään ID:tä vastaava objekti tiedostosta ja poistetaan se
  items.items = items.items.filter((item) => item.id !== id);
  // Tallennetaan tiedosto
  saveDataToFile(file, items);
  response.status(204).end();
});

// Get
app.get("/", (request, response) => {
  response.send("<p>Server is running</p>");
});

app.get("/api/items", (request, response) => {
  response.json(items.items);
});

// Node Express toiminnallisuus
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
