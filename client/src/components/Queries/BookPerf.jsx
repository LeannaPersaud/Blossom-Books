import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import Accordion from 'react-bootstrap/Accordion';

export default function BookPerformanceLookup() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [books, setBooks] = useState([]);
  
  useEffect(() => {
      async function fetchBooks() {
          try {
              const bookRes = await fetch("http://localhost:5050/books")
              const bookData = await bookRes.json();
  
              setBooks(bookData);
          } catch (err) {
              console.error("Error fetching dropdown data:", err);
          }
      }
  
      fetchBooks();
  }, []);

  const bookOptions = books.map(b => ({
    value: b.BookID,
    label: `${b.BookID} - ${b.Title}`
  }));

  async function fetchPerformance(e) {
    e.preventDefault()

    if (!selectedBook) return;

    try {
      const res = await fetch(`http://localhost:5050/queries/bookPerf/${selectedBook.value}`);

      const data = await res.json();
      setPerformance(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container bg-white mt-4 p-3 rounded rounded-3">
      <h3>Book Performance Lookup</h3>

      <Form onSubmit={fetchPerformance}>
      <Form.Group controlId="formBookID">
          <Form.Label>Book ID</Form.Label>
          <Select options={bookOptions} value={selectedBook} onChange={setSelectedBook} inputId="formBookID" isClearable/>
      </Form.Group>

        <Button type="submit" style={{ marginTop: "10px" }}>
          Search
        </Button>
      </Form>

      {performance.length > 0 && (<><div className="border rounded rounded-2 p-3 mt-3">
          <h5>Book:&ensp;{performance[0]?.Title}</h5>
          <h6>&emsp;Author:&ensp;{performance[0]?.Author?.FirstName} {performance[0]?.Author?.LastName}</h6>
          <h6>&emsp;ISBN:&ensp;{performance[0]?.ISBN}</h6>
          <h6>&emsp;Price:&ensp;${performance[0]?.Price}</h6>
          <h6>&emsp;Total Number of Reviews:&ensp;{performance[0]?.totalReviews}</h6>
          <h6>&emsp;Average Review Rating:&ensp;{performance[0]?.avgRating}</h6>
          <h6>&emsp;Total Number of Orders:&ensp;{performance[0]?.totalOrders}</h6>
      </div>
        <Accordion className="mt-3">
        <Accordion.Item eventKey="0">
            <Accordion.Header>Review Details</Accordion.Header>
            <Accordion.Body>
                <Accordion>
                    {performance[0]?.ReviewDetails?.map((review) => (
                        <Accordion.Item key={review.ReviewID} eventKey={review.ReviewID}>
                            <Accordion.Header><span className="fw-bold">Review {review.ReviewID}</span></Accordion.Header>
                            <Accordion.Body>
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th scope="col">Field</th>
                                            <th scope="col">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Customer ID</td>
                                            <td>{review.CustID}</td>
                                        </tr>
                                        <tr>
                                            <td>Book ID</td>
                                            <td>{review.BookID}</td>
                                        </tr>
                                        <tr>
                                            <td>Rating</td>
                                            <td>{review.Rating}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Accordion.Body>
        </Accordion.Item>
      </Accordion>
        <Accordion className="mt-3">
        <Accordion.Item eventKey="1">
            <Accordion.Header>Order Details</Accordion.Header>
            <Accordion.Body>
                <Accordion>
                    {performance[0]?.OrderDetails?.map((order) => (
                        <Accordion.Item key={order.OrderID} eventKey={order.OrderID}>
                            <Accordion.Header><span className="fw-bold">Order {order.OrderID}</span> &emsp; {order.Date}</Accordion.Header>
                            <Accordion.Body>
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th scope="col">Field</th>
                                            <th scope="col">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Customer ID</td>
                                            <td>{order.CustID}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Price</td>
                                            <td>${order.TotalPrice}</td>
                                        </tr>
                                        <tr>
                                            <td>Books</td>
                                            <td>{order.Books.join(", ")}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Accordion.Body>
        </Accordion.Item>
      </Accordion></>)}
    </div>
  );
}