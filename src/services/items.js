import axios from "axios";

const BASE_URL = "http://localhost:3001/items";

// Noutaa kaikki tiedot json palvelimelta
const getAll = () => {
  const request = axios.get(BASE_URL);
  return request.then((response) => response.data);
};

// Poistaa palvelimelta tiedon annetun ID:n mukaan
const deleteData = (id) => {
  const request = axios.delete(`${BASE_URL}/${id}`);
  return request.then((response) => response.data);
};

// Lisää dataa palvelimelle
const addData = (newNoteObject) => {
  const request = axios.post(BASE_URL, newNoteObject);
  return request.then((response) => response.data);
};

// Export
export default {
  getAll: getAll,
  deleteData: deleteData,
  addData: addData,
};
