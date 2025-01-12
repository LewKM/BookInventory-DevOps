import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import axios from 'axios';
import Books from './books/Books';
import { Container, Button } from 'react-bootstrap';

const App = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get('http://10.99.72.218:8080/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  return (
    <Container>
      <Routes> {/* Define your routes here */}
        <Route
          path="/"
          element={
            <div className="text-center mt-5">
              <h1 className="display-4">Book Inventory</h1>
              <Button variant="success" size="lg" href="/books">
                View Books
              </Button>
            </div>
          }
        />
        <Route path="/books" element={<Books books={books} />} />
      </Routes>
    </Container>
  );
};

export default App;
