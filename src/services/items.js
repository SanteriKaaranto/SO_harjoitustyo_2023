import axios from 'axios'

const BASE_URL = 'http://localhost:3001/items'

const getAll  = () => {
    const request = axios.get(BASE_URL)
    return request.then(response => response.data)
};

const deleteData = (id) => {
    const request = axios.delete(`${BASE_URL}/${id}`)
    return request.then(response => response.data)
};

const addData  = (newNoteObject) => {
    const request = axios.post(BASE_URL, newNoteObject)
    return request.then(response => response.data)
};

export default {
  getAll : getAll,
  deleteData: deleteData,
  addData: addData
};
