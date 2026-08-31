import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal';

function Order(props){
    return(
        <Card className="book-card d-flex flex-column h-100">
            <Card.Body className="d-flex flex-column">
                <Card.Title>Order {props.order.OrderID} </Card.Title>
                <Card.Subtitle className="mb-2">{props.order.CustID}</Card.Subtitle>

                <div className="fs-6 mt-auto">
                    Date: {props.order.Date} <br/>
                    Total Price ${Number(props.order.TotalPrice).toFixed(2)} <br/>
                    Books Bought: {props.order.Books.join(", ")}
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <Link to={`/orders/edit/${props.order._id}`}>
                        <button className="btn btn-sm btn-success" onClick={(e)=>e.stopPropagation()}>
                            Edit
                        </button>
                    </Link>
                    <button className="btn btn-sm btn-danger ms-2" onClick={(e) => {
                            e.stopPropagation();  
                            props.deleteOrder(props.order._id)
                        }}>
                        Delete
                    </button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default function OrderList(){
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function getOrders() {
            const response = await fetch(`http://localhost:5050/orders/`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const orders = await response.json();
            setOrders(orders);
        }
        getOrders();
        return;
    }, [orders.length]);

    async function deleteOrder(id) {
        await fetch(`http://localhost:5050/orders/${id}`, {method: "DELETE",});
        const newOrders = orders.filter((el) => el._id !== id);
        setOrders(newOrders);
    }

    return(
        <>
          <Container className="p-4">
            <Row>
            {orders.map((order) => (
                <Col key={order._id} sm={12} md={6} lg={3} className="mb-3 d-flex align-items-stretch">
                    <div key={order._id} onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                    }} className="h-100 w-100">
                    <Order order={order} deleteOrder={deleteOrder}/>
                    </div>
                </Col>
            ))}
            </Row>
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            {selectedOrder && (
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>View Order</Modal.Title>
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
                                    <td>Order ID</td>
                                    <td>{selectedOrder.OrderID}</td>
                                </tr>
                                <tr>
                                    <td>Customer ID</td>
                                    <td>{selectedOrder.CustID}</td>
                                </tr>
                                <tr>
                                    <td>Date</td>
                                    <td>{selectedOrder.Date}</td>
                                </tr>
                                <tr>
                                    <td>Total Price</td>
                                    <td>{selectedOrder.TotalPrice}</td>
                                </tr>
                                <tr>
                                    <td>Books</td>
                                    <td>{selectedOrder.Books.join(", ")}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-evenly">
                            <Link to={`/orders/edit/${selectedOrder._id}`}>
                            <button className="btn btn-md btn-success" onClick={(e)=>e.stopPropagation()}>
                                Edit
                            </button>
                            </Link>
                            <button className="btn btn-md btn-danger ms-2" onClick={(e) => {
                                    e.stopPropagation();  
                                    deleteOrder(selectedOrder._id);
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