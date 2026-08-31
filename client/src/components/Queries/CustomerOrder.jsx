import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import Accordion from 'react-bootstrap/Accordion';

export default function CustomerOrderLookup() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  useEffect(() => {
      async function fetchCustomers() {
          try {
              const cusRes = await fetch("http://localhost:5050/customers")
              const cusData = await cusRes.json();
  
              setCustomers(cusData);
          } catch (err) {
              console.error("Error fetching dropdown data:", err);
          }
      }
  
      fetchCustomers();
  }, []);

  const customerOptions = customers.map(c => ({
    value: c.CustID,
    label: `${c.CustID} - ${c.Name}`
  }));

  async function fetchOrders(e) {
    e.preventDefault()

    if (!selectedCustomer) return;

    try {
      const res = await fetch(`http://localhost:5050/queries/custOrders/${selectedCustomer.value}`);

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container bg-white mt-4 p-3 rounded rounded-3">
      <h3>Customer Orders Lookup</h3>

      <Form onSubmit={fetchOrders}>
      <Form.Group controlId="formCustID">
          <Form.Label>Customer ID</Form.Label>
          <Select options={customerOptions} value={selectedCustomer} onChange={setSelectedCustomer} inputId="formCustID" isClearable/>
      </Form.Group>

        <Button type="submit" style={{ marginTop: "10px" }}>
          Search
        </Button>
      </Form>

      {orders.length > 0 && (<div className="border rounded rounded-2 p-3 mt-3">
          <h5>Customer:&ensp;{orders[0]?.Customer?.Name}</h5>
          <h6>&emsp; Phone Number:&ensp;{orders[0]?.Customer?.Phone}</h6>
      </div>)}
      <Accordion className="mt-3">
        {orders.map((order) => (
          <Accordion.Item key={order.OrderID} eventKey={order.OrderID}>
            <Accordion.Header ><span className="fw-bold">Order {order.OrderID}</span> &emsp; {order.Date}</Accordion.Header>
            <Accordion.Body>
              <h5>Total Price: ${order.TotalPrice}</h5>
              <Accordion>
                {order.BookDetails.map((book) => (
                  <Accordion.Item key={book.BookID} eventKey={book.BookID}>
                    <Accordion.Header><span className="fw-bold">{book.BookID}</span> &ensp; - &ensp; {book.Title}</Accordion.Header>
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
                                    <td>Author ID</td>
                                    <td>{book.AuthID}</td>
                                </tr>
                                <tr>
                                    <td>Genre</td>
                                    <td>{book.Genre}</td>
                                </tr>
                                <tr>
                                    <td>ISBN</td>
                                    <td>{book.ISBN}</td>
                                </tr>
                                <tr>
                                    <td>Format</td>
                                    <td>{book.Format}</td>
                                </tr>
                                <tr>
                                    <td>Pages</td>
                                    <td>{book.Pages}</td>
                                </tr>
                                <tr>
                                    <td>Price</td>
                                    <td>{Number(book.Price).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Publisher ID</td>
                                    <td>{book.PubID}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}