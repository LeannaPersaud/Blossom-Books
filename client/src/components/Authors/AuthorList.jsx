import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal';

function Author(props){
    return(
        <Card className="book-card d-flex flex-column h-100">
            <Card.Body className="d-flex flex-column">
                <Card.Title>{props.author.FirstName} {props.author.LastName}</Card.Title>
                <Card.Subtitle className="mb-2">{props.author.AuthID}</Card.Subtitle>

                <div className="mt-auto">
                    Country of Origin: {props.author.Residence}
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <Link to={`/authors/edit/${props.author._id}`}>
                        <button className="btn btn-sm btn-success" onClick={(e)=>e.stopPropagation()}>
                            Edit
                        </button>
                    </Link>
                    <button className="btn btn-sm btn-danger ms-2" onClick={(e) => {
                            e.stopPropagation();  
                            props.deleteAuthor(props.author._id)
                        }}>
                        Delete
                    </button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default function AuthorList(){
    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function getAuthors() {
            const response = await fetch(`http://localhost:5050/authors/`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const authors = await response.json();
            setAuthors(authors);
        }
        getAuthors();
        return;
    }, [authors.length]);

    async function deleteAuthor(id) {
        await fetch(`http://localhost:5050/authors/${id}`, {method: "DELETE",});
        const newAuthors = authors.filter((el) => el._id !== id);
        setAuthors(newAuthors);
    }

    return(
        <>
          <Container className="p-4">
            <Row>
            {authors.map((author) => (
                <Col key={author._id} sm={12} md={6} lg={3} className="mb-3 d-flex align-items-stretch">
                    <div key={author._id} onClick={() => {
                        setSelectedAuthor(author);
                        setShowModal(true);
                    }} className="h-100 w-100">
                    <Author author={author} deleteAuthor={deleteAuthor}/>
                    </div>
                </Col>
            ))}
            </Row>
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            {selectedAuthor && (
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>View Author</Modal.Title>
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
                                    <td>Author ID</td>
                                    <td>{selectedAuthor.AuthID}</td>
                                </tr>
                                <tr>
                                    <td>First Name</td>
                                    <td>{selectedAuthor.FirstName}</td>
                                </tr>
                                <tr>
                                    <td>Last Name</td>
                                    <td>{selectedAuthor.LastName}</td>
                                </tr>
                                <tr>
                                    <td>Residence</td>
                                    <td>{selectedAuthor.Residence}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-evenly">
                            <Link to={`/authors/edit/${selectedAuthor._id}`}>
                            <button className="btn btn-md btn-success" onClick={(e)=>e.stopPropagation()}>
                                Edit
                            </button>
                            </Link>
                            <button className="btn btn-md btn-danger ms-2" onClick={(e) => {
                                    e.stopPropagation();  
                                    deleteAuthor(selectedAuthor._id);
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