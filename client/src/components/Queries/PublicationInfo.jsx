import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import Accordion from 'react-bootstrap/Accordion';

export default function PublisherInformationLookup() {
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [information, setInformation] = useState([]);
  const [publishers, setPublishers] = useState([]);
  
  useEffect(() => {
      async function fetchPublishers() {
          try {
              const publisherRes = await fetch("http://localhost:5050/publishers")
              const publisherData = await publisherRes.json();
  
              setPublishers(publisherData);
          } catch (err) {
              console.error("Error fetching dropdown data:", err);
          }
      }
  
      fetchPublishers();
  }, []);

  const publisherOptions = publishers.map(p => ({
    value: p.PubID,
    label: `${p.PubID} - ${p.PublishingHouse}`
  }));

  async function fetchInformation(e) {
    e.preventDefault()

    if (!selectedPublisher) return;

    try {
      const res = await fetch(`http://localhost:5050/queries/pubInfo/${selectedPublisher.value}`);

      const data = await res.json();
      setInformation(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container bg-white mt-4 p-3 rounded rounded-3">
      <h3>Publisher Information Lookup</h3>

      <Form onSubmit={fetchInformation}>
      <Form.Group controlId="formPubID">
          <Form.Label>Publisher ID</Form.Label>
          <Select options={publisherOptions} value={selectedPublisher} onChange={setSelectedPublisher} inputId="formPubID" isClearable/>
      </Form.Group>

        <Button type="submit" style={{ marginTop: "10px" }}>
          Search
        </Button>
      </Form>

      {information.length > 0 && (<><div className="bauthor rounded rounded-2 p-3 mt-3">
          <h5>Publisher:&ensp;{information[0]?.PublishingHouse}</h5>
          <h6>&emsp;Location:&ensp;{information[0]?.City}, {information[0]?.State}, {information[0]?.Country}</h6>
          <h6>&emsp;Year Established:&ensp;{information[0]?.YearEstablished}</h6>
          <h6>&emsp;Marketing Spend:&ensp;${Number(information[0].MarketingSpend).toLocaleString()}</h6>
      </div>
        <Accordion className="mt-3">
        <Accordion.Item eventKey="0">
            <Accordion.Header>Published Books</Accordion.Header>
            <Accordion.Body>
                <Accordion>
                    {information[0]?.Books?.map((book) => (
                        <Accordion.Item key={book.BookID} eventKey={book.BookID}>
                            <Accordion.Header><span className="fw-bold">Book {book.BookID}</span> &ensp; - &ensp; {book.Title}</Accordion.Header>
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
                                            <td>${Number(book.Price).toFixed(2)}</td>
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
            <Accordion.Header>Published Authors</Accordion.Header>
            <Accordion.Body>
                <Accordion>
                    {information[0]?.Authors?.map((author) => (
                        <Accordion.Item key={author.AuthID} eventKey={author.AuthID}>
                            <Accordion.Header><span className="fw-bold">Author {author.AuthID}</span> &ensp; - &ensp; {author.FirstName} {author.LastName}</Accordion.Header>
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
                                            <td>Country of Residence</td>
                                            <td>{author.Residence}</td>
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