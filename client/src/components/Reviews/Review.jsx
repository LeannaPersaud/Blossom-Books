import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Select from "react-select";

export default function Review(){
const [form, setForm] = useState({
    BookID: "",
    Rating: "",
    ReviewID: "",
    CustID: ""
})

const params = useParams();
const navigate = useNavigate();

const [errors, setErrors] = useState({});
const [books, setBooks] = useState([]);
const [customers, setCustomers] = useState([]);

useEffect(() => {
    async function fetchLists() {
        try {
            const bookRes = await fetch("http://localhost:5050/books")
            const pubRes = await fetch("http://localhost:5050/customers")

            const bookData = await bookRes.json();
            const pubData = await pubRes.json();

            setBooks(bookData);
            setCustomers(pubData);
        } catch (err) {
            console.error("Error fetching dropdown data:", err);
        }
    }

    fetchLists();
}, []);

const bookOptions = books.map(b => ({
    value: b.BookID,
    label: `${b.BookID} - ${b.Title}`
}));

const customerOptions = customers.map(c => ({
    value: c.CustID,
    label: `${c.CustID} - ${c.Name}`
}));

useEffect(() => {
async function fetchData() {
    const id = params.id?.toString() || undefined;
    if(!id) return;
    const response = await fetch(`http://localhost:5050/reviews/${params.id.toString()}`);

    if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
    }

    const review = await response.json();
    if (!review) {
        console.warn(`Review with id ${id} not found`);
        navigate("/reviews");
        return;
    }
        setForm({
            ReviewID: review.ReviewID ?? "",
            Rating: review.Rating ?? "",
            BookID: review.BookID ?? "",
            CustID: review.CustID ?? ""
        });
    }
    fetchData();
    return;
}, [params.id, navigate]);

function updateForm(value) {
    return setForm((prev) => {
        return { ...prev, ...value };
    });
}

async function onSubmit(e) {
    e.preventDefault();
    let errors = {}

    if(form.ReviewID && !Number.isInteger(Number(form.ReviewID))){
        errors.ReviewID = "ReviewID must be a number"
    }

    if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
    }

    const review = { ...form };
    review.ReviewID = Number(review.ReviewID)
    review.Rating = Number(review.Rating)

    try {
        const response = await fetch(`http://localhost:5050/reviews${params.id ? "/"+params.id : ""}`, {
            method: `${params.id ? "PATCH" : "POST"}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(review)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } 
    catch (error) {
        console.error('A problem occurred with your fetch operation: ', error);
    } 
    finally {
        setForm({
            BookID: "",
            Rating: "",
            ReviewID: "",
            CustID: ""
        }
        );
        navigate("/reviews");
    }
}

  return(
    <div className="container bg-white my-4 rounded rounded-3">
        <h3 className="p-3">Create/Update a Review</h3>
        <Form onSubmit={onSubmit} className="p-3">
            <div className="row my-5">
                <div className="col-6">
                    <Form.Group controlId="formReviewID">
                        <Form.Label>Review ID</Form.Label>
                        <Form.Control type="text"
                         isInvalid={!!errors.ReviewID} value={form.ReviewID} onChange={(e) => updateForm({ReviewID: e.target.value})}/>
                         <Form.Control.Feedback type="invalid">{errors.ReviewID}</Form.Control.Feedback>
                    </Form.Group>
                </div>
                <div className="col-6">
                    <Form.Group controlId="formRating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select value={form.Rating} onChange={(e) => updateForm({Rating: e.target.value})}>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </Form.Select>
                    </Form.Group>
                </div>
            </div>
            <div className="row my-5">
                <div className="col-6">
                    <Form.Group controlId="formBookID">
                        <Form.Label>Book ID</Form.Label>
                        <Select options={bookOptions} value={bookOptions.find(opt => opt.value === form.BookID) || null}
                            inputId="formBookID" onChange={(selected) => updateForm({ BookID: selected ? selected.value : "" })} isClearable
                        />
                    </Form.Group>
                </div>
                <div className="col-6">
                    <Form.Group controlId="formCustID">
                        <Form.Label>Customer ID</Form.Label>
                        <Select options={customerOptions} value={customerOptions.find(opt => opt.value === form.CustID) || null}
                            inputId="formCustID" onChange={(selected) => updateForm({ CustID: selected ? selected.value : "" })} isClearable
                        />
                    </Form.Group>
                </div>
            </div>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    </div>
  )
}