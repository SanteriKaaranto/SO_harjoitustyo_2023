// Santeri Kaaranto TITE21. Selainohjelmointi harjoitustyö 2023.

// Importit
import { useState, useEffect } from "react";
import dataService from "./services/items";
import "./index.css";

// Header muuttuja. Muotoilee tuoterivin
const Header = ({ itemname, itemnumber, onDelete }) => (
  <div className="item-container">
    <p>{itemname}</p>
    <p>{itemnumber} kpl</p>
    <button onClick={onDelete}>Poista</button>
  </div>
);

// Muuttujalle annetaan tuote propertynä ja muotoillaan se.
const Item = ({ item, onDelete }) => {
  return (
    <div>
      <Header
        itemname={item.name}
        itemnumber={item.count}
        onDelete={onDelete}
      />
    </div>
  );
};

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [numberOfItems, setNumberOfItems] = useState([]);

  // Muuttuja datan hakemiseen json palvelimelta.
  const fetchData = () => {
    // Käyttää erillisessä tiedostossa olevia axios komentoja, joita voidaan käyttää annetun 'dataService' avulla.
    dataService
      .getAll()
      .then((initialData) => {
        console.log("Datan hakeminen onnistui");
        setItems(initialData);
      }) // Napataan virhe, jos dataa ei voitu hakea.
      .catch((error) => {
        console.error("Virhe haettaessa dataa:", error);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Muuttuja datan poistamiseen
  const deleteItem = (id) => {
    // Lähettää poistamis pyynnön palvelimelle
    dataService
      .deleteData(id)
      .then((returnedData) => {
        console.log("Data poistettu");
        fetchData();
      }) // napataan error, jos dataa ei voitu poistaa
      .catch((error) => {
        console.error("Virhe poistaessa dataa:", error);
      });
  };

  // Tuotteiden lisääminen
  const addItem = (event) => {
    // Estää alkuperäisen toiminnallisuuden, eli tässä tapauksessa formin aiheuttaman sivun uudelleenlatauksen.
    event.preventDefault(); 

    // Tarkistetaan, että tuote ja määrä ei ole tyhjiä tai 0
    if (newItem.trim() === "" || numberOfItems === 0) {
      alert("Syötä item ja määrä");
      return;
    }

    // Tarkistetaan, että tuotteiden määrä on numero
    const numberOfItemsParsed = parseInt(numberOfItems, 10); // 10 = desimaali
    if (isNaN(numberOfItemsParsed)) {
      alert("Määrän on oltava numero!");
      return;
    } else {
      // Uutta tuotetta vastaava olio
      const newItemObject = {
        name: newItem,
        count: numberOfItems,
        id: items.length + 1,
      };

      // Päivitetään tiedot palvelimelle
      dataService
        .addData(newItemObject)
        // Asetetaan palautunut data uudeksi itemin arvoksi ja asetetaan syöttökentät tyhjiksi
        .then((returnedData) => {
          console.log(returnedData);
          setItems(items.concat(returnedData));
          setNewItem("");
          setNumberOfItems("");
        });
    }
  };

  return (
    <div className="sisalto">
      <h2>Ostoslista</h2>

      {/* Form joka sisältää datan syöttö kentät ja napin */}
      <form onSubmit={addItem}>
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Syötä tuote..."
          maxLength={40}
        />

        <input
          value={numberOfItems}
          onChange={(e) => setNumberOfItems(e.target.value)}
          placeholder="Määrä..."
        />

        <button type="submit">Lisää</button>
      </form>

      {/* map funktio käy datan läpi ja luo niistä propertyt, jotka lähetetään item muuttujalle. */}
      {items.map((item) => (
        <div key={item.id}>
          <Item item={item} onDelete={() => deleteItem(item.id)} />
        </div>
      ))}
    </div>
  );
};
export default App;
