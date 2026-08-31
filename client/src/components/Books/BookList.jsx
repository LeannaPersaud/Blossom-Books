import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal';

function Book(props){
    return(
        <Card className="book-card d-flex flex-column h-100">
            <Card.Img variant="top" src={props.book.Cover}/>

            <Card.Body className="d-flex flex-column">
                <Card.Title>{props.book.Title}</Card.Title>
                <Card.Subtitle className="mb-2">{props.book.AuthID}</Card.Subtitle>

                <div className="mb-2">
                    Genre: <span className="badge accent-bg">{props.book.Genre}</span>
                </div>

                <div className="book-price fs-5 mt-auto">
                    ${Number(props.book.Price).toFixed(2)}
                </div>

                <div className="mt-auto d-flex justify-content-end">
                    <Link to={`/books/edit/${props.book._id}`}>
                        <button className="btn btn-sm btn-success" onClick={(e)=>e.stopPropagation()}>
                            Edit
                        </button>
                    </Link>
                    <button className="btn btn-sm btn-danger ms-2" onClick={(e) => {
                            e.stopPropagation();  
                            props.deleteBook(props.book._id)
                        }}>
                        Delete
                    </button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default function BookList(){
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function getBooks() {
            const response = await fetch(`http://localhost:5050/books/`);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                console.error(message);
                return;
            }
            const books = await response.json();
            setBooks(books);
        }
        getBooks();
        return;
    }, [books.length]);

    async function deleteBook(id) {
        await fetch(`http://localhost:5050/books/${id}`, {method: "DELETE",});
        const newBooks = books.filter((el) => el._id !== id);
        setBooks(newBooks);
    }

    return(
        <>
          <Container className="p-4">
            <Row>
            {books.map((book) => (
                <Col key={book._id} sm={12} md={6} lg={3} className="mb-3 d-flex">
                    <div key={book._id} onClick={() => {
                        setSelectedBook(book);
                        setShowModal(true);
                    }}>
                    <Book book={book} deleteBook={deleteBook}/>
                    </div>
                </Col>
            ))}
            </Row>
        </Container>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            {selectedBook && (
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>View Book</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <img src={selectedBook.Cover} alt={selectedBook.Title} style={{ width: "100%", marginBottom: "15px" }}/>
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th scope="col">Field</th>
                                    <th scope="col">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Book ID</td>
                                    <td>{selectedBook.BookID}</td>
                                </tr>
                                <tr>
                                    <td>Book Title</td>
                                    <td>{selectedBook.Title}</td>
                                </tr>
                                <tr>
                                    <td>Author ID</td>
                                    <td>{selectedBook.AuthID}</td>
                                </tr>
                                <tr>
                                    <td>Genre</td>
                                    <td>{selectedBook.Genre}</td>
                                </tr>
                                <tr>
                                    <td>ISBN</td>
                                    <td>{selectedBook.ISBN}</td>
                                </tr>
                                <tr>
                                    <td>Format</td>
                                    <td>{selectedBook.Format}</td>
                                </tr>
                                <tr>
                                    <td>Pages</td>
                                    <td>{selectedBook.Pages}</td>
                                </tr>
                                <tr>
                                    <td>Price</td>
                                    <td>{Number(selectedBook.Price).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Publisher ID</td>
                                    <td>{selectedBook.PubID}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-evenly">
                            <Link to={`/books/edit/${selectedBook._id}`}>
                            <button className="btn btn-md btn-success" onClick={(e)=>e.stopPropagation()}>
                                Edit
                            </button>
                            </Link>
                            <button className="btn btn-md btn-danger ms-2" onClick={(e) => {
                                    e.stopPropagation();  
                                    deleteBook(selectedBook._id);
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