import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal';

function Review(props){
    return(
        <Card className="book-card d-flex flex-column h-100">
            <Card.Body className="d-flex flex-column">
                <Card.Title>Customer: {props.review.CustID} <br/> Book: {props.review.BookID} </Card.Title>
                <Card.Subtitle className="mb-2">{props.review.ReviewID}</Card.Subtitle>

                <div className="fs-6 mt-auto">
                    Rating: {props.review.Rating}
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <Link to={`/reviews/edit/${props.review._id}`}>
                        <button className="btn btn-sm btn-success" onClick={(e)=>e.stopPropagation()}>
                            Edit
                        </button>
                    </Link>
                    <button className="btn btn-sm btn-danger ms-2" onClick={(e) => {
                            e.stopPropagation();  
                            props.deleteReview(props.review._id)
                        }}>
                        Delete
                    </button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default function ReviewList(){
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function getReviews() {
            const response = await fetch(`http://localhost:5050/reviews/`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const reviews = await response.json();
            setReviews(reviews);
        }
        getReviews();
        return;
    }, [reviews.length]);

    async function deleteReview(id) {
        await fetch(`http://localhost:5050/reviews/${id}`, {method: "DELETE",});
        const newReviews = reviews.filter((el) => el._id !== id);
        setReviews(newReviews);
    }

    return(
        <>
          <Container className="p-4">
            <Row>
            {reviews.map((review) => (
                <Col key={review._id} sm={12} md={6} lg={3} className="mb-3 d-flex align-items-stretch">
                    <div key={review._id} onClick={() => {
                        setSelectedReview(review);
                        setShowModal(true);
                    }} className="h-100 w-100">
                    <Review review={review} deleteReview={deleteReview}/>
                    </div>
                </Col>
            ))}
            </Row>
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            {selectedReview && (
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>View Review</Modal.Title>
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
                                    <td>Review ID</td>
                                    <td>{selectedReview.ReviewID}</td>
                                </tr>
                                <tr>
                                    <td>Customer ID</td>
                                    <td>{selectedReview.CustID}</td>
                                </tr>
                                <tr>
                                    <td>Book ID</td>
                                    <td>{selectedReview.BookID}</td>
                                </tr>
                                <tr>
                                    <td>Rating</td>
                                    <td>{selectedReview.Rating}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-evenly">
                            <Link to={`/reviews/edit/${selectedReview._id}`}>
                            <button className="btn btn-md btn-success" onClick={(e)=>e.stopPropagation()}>
                                Edit
                            </button>
                            </Link>
                            <button className="btn btn-md btn-danger ms-2" onClick={(e) => {
                                    e.stopPropagation();  
                                    deleteReview(selectedReview._id);
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