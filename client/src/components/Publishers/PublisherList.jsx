import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal';

function Publisher(props){
    return(
        <Card className="book-card d-flex flex-column h-100">
            <Card.Body className="d-flex flex-column">
                <Card.Title>{props.publisher.PublishingHouse}</Card.Title>
                <Card.Subtitle className="mb-2">{props.publisher.PubID}</Card.Subtitle>

                <div className="mt-auto">
                    Location: {props.publisher.City}, {props.publisher.State}, {props.publisher.Country} <br/>
                    Established: {props.publisher.YearEstablished} <br/>
                    Marketing Spend: ${Number(props.publisher.MarketingSpend).toLocaleString()}
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <Link to={`/publishers/edit/${props.publisher._id}`}>
                        <button className="btn btn-sm btn-success" onClick={(e)=>e.stopPropagation()}>
                            Edit
                        </button>
                    </Link>
                    <button className="btn btn-sm btn-danger ms-2" onClick={(e) => {
                            e.stopPropagation();  
                            props.deletePublisher(props.publisher._id)
                        }}>
                        Delete
                    </button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default function PublisherList(){
    const [publishers, setPublishers] = useState([]);
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function getPublishers() {
            const response = await fetch(`http://localhost:5050/publishers/`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const publishers = await response.json();
            setPublishers(publishers);
        }
        getPublishers();
        return;
    }, [publishers.length]);

    async function deletePublisher(id) {
        await fetch(`http://localhost:5050/publishers/${id}`, {method: "DELETE",});
        const newPublishers = publishers.filter((el) => el._id !== id);
        setPublishers(newPublishers);
    }

    return(
        <>
          <Container className="p-4">
            <Row>
            {publishers.map((publisher) => (
                <Col key={publisher._id} sm={12} md={6} lg={3} className="mb-3 d-flex align-items-stretch">
                    <div key={publisher._id} onClick={() => {
                        setSelectedPublisher(publisher);
                        setShowModal(true);
                    }} className="h-100 w-100">
                    <Publisher publisher={publisher} deletePublisher={deletePublisher}/>
                    </div>
                </Col>
            ))}
            </Row>
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            {selectedPublisher && (
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>View Publisher</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th scope="col">Field</th>
                                    <th scope="col">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Publisher ID</td>
                                    <td>{selectedPublisher.PubID}</td>
                                </tr>
                                <tr>
                                    <td>Publishing House</td>
                                    <td>{selectedPublisher.PublishingHouse}</td>
                                </tr>
                                <tr>
                                    <td>City</td>
                                    <td>{selectedPublisher.City}</td>
                                </tr>
                                <tr>
                                    <td>State</td>
                                    <td>{selectedPublisher.State}</td>
                                </tr>
                                <tr>
                                    <td>Country</td>
                                    <td>{selectedPublisher.Country}</td>
                                </tr>
                                <tr>
                                    <td>Year Established</td>
                                    <td>{selectedPublisher.YearEstablished}</td>
                                </tr>
                                <tr>
                                    <td>Marketing Spend</td>
                                    <td>{selectedPublisher.MarketingSpend}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-evenly">
                            <Link to={`/publishers/edit/${selectedPublisher._id}`}>
                            <button className="btn btn-md btn-success" onClick={(e)=>e.stopPropagation()}>
                                Edit
                            </button>
                            </Link>
                            <button className="btn btn-md btn-danger ms-2" onClick={(e) => {
                                    e.stopPropagation();  
                                    deletePublisher(selectedPublisher._id);
                                    setShowModal(false);
                                }}>
                                Delete
                            </button>
                        </div>
                    </Modal.Body>
                </>
            )}
        </Modal>
        </>
    )
}