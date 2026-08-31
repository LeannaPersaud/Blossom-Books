import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal';

function Customer(props){
    return(
        <Card className="book-card d-flex flex-column h-100">
            <Card.Body className="d-flex flex-column">
                <Card.Title>{props.customer.Name}</Card.Title>
                <Card.Subtitle className="mb-2">{props.customer.CustID}</Card.Subtitle>

                <div className="mt-auto">
                    Phone Number: {props.customer.Phone}
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <Link to={`/customers/edit/${props.customer._id}`}>
                        <button className="btn btn-sm btn-success" onClick={(e)=>e.stopPropagation()}>
                            Edit
                        </button>
                    </Link>
                    <button className="btn btn-sm btn-danger ms-2" onClick={(e) => {
                            e.stopPropagation();  
                            props.deleteCustomer(props.customer._id)
                        }}>
                        Delete
                    </button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default function CustomerList(){
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function getCustomers() {
            const response = await fetch(`http://localhost:5050/customers/`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const customers = await response.json();
            setCustomers(customers);
        }
        getCustomers();
        return;
    }, [customers.length]);

    async function deleteCustomer(id) {
        await fetch(`http://localhost:5050/customers/${id}`, {method: "DELETE",});
        const newCustomers = customers.filter((el) => el._id !== id);
        setCustomers(newCustomers);
    }

    return(
        <>
          <Container className="p-4">
            <Row>
            {customers.map((customer) => (
                <Col key={customer._id} sm={12} md={6} lg={3} className="mb-3 d-flex align-items-stretch">
                    <div key={customer._id} onClick={() => {
                        setSelectedCustomer(customer);
                        setShowModal(true);
                    }} className="h-100 w-100">
                    <Customer customer={customer} deleteCustomer={deleteCustomer}/>
                    </div>
                </Col>
            ))}
            </Row>
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            {selectedCustomer && (
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>View Customer</Modal.Title>
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
                                    <td>Customer ID</td>
                                    <td>{selectedCustomer.CustID}</td>
                                </tr>
                                <tr>
                                    <td>Name</td>
                                    <td>{selectedCustomer.Name}</td>
                                </tr>
                                <tr>
                                    <td>Phone</td>
                                    <td>{selectedCustomer.Phone}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-evenly">
                            <Link to={`/customers/edit/${selectedCustomer._id}`}>
                            <button className="btn btn-md btn-success" onClick={(e)=>e.stopPropagation()}>
                                Edit
                            </button>
                            </Link>
                            <button className="btn btn-md btn-danger ms-2" onClick={(e) => {
                                    e.stopPropagation();  
                                    deleteCustomer(selectedCustomer._id);
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