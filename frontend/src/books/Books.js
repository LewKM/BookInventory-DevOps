import React from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';

const Books = ({ books }) => {
  return (
    <Container className="mt-5">
      <Row>
        {books.map(book => (
          <Col sm={12} md={6} lg={4} key={book.id} className="mb-4">
            <Card className="shadow-lg border-light rounded">
              <Card.Body>
                <Card.Title className="text-center text-primary">{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted text-center">
                  by {book.author}
                </Card.Subtitle>
                <Button variant="outline-primary" className="w-100">
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Books;
