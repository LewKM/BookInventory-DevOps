import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Books from './books/Books';
import { Container, Button, Row, Col} from 'react-bootstrap';
import './App.css'; // Import the CSS file

const App = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get('http://10.99.72.218:8080/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  return (
    <Container fluid>
      <Routes>
        <Route
          path="/"
          element={
            <div className="text-center mt-5 app-background">
              <h1 className="display-4 text-white mb-4 heading">Book Inventory</h1>
              <p className="lead text-white mb-4">
                Welcome to the Book Inventory system, where you can view a list of amazing books available for you to explore!
              </p>
              <Button variant="light" size="lg" href="/books" className="btn-view-books">
                View Books
              </Button>

              <section className="features mt-5">
                <h2 className="text-white">Why Choose Us?</h2>
                <Row className="text-white mt-4">
                  <Col sm={12} md={4}>
                    <div className="feature-box">
                      <h4>Wide Selection</h4>
                      <p>Explore a wide range of books from different genres and authors.</p>
                    </div>
                  </Col>
                  <Col sm={12} md={4}>
                    <div className="feature-box">
                      <h4>Easy to Use</h4>
                      <p>Our platform is designed to provide an easy and seamless browsing experience.</p>
                    </div>
                  </Col>
                  <Col sm={12} md={4}>
                    <div className="feature-box">
                      <h4>Regular Updates</h4>
                      <p>New books are added regularly to keep our collection fresh and up-to-date.</p>
                    </div>
                  </Col>
                </Row>
              </section>

              

              <footer className="footer mt-5">
                <p className="text-white">© 2025 Book Inventory. All Rights Reserved.</p>
              </footer>
            </div>
          }
        />
        <Route path="/books" element={<Books books={books} />} />
      </Routes>
    </Container>
  );
};

export default App;
