import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Select from "react-select";

export default function Order(){
const [form, setForm] = useState({
    OrderID: "",
    Date: "",
    Books: [],
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
    const response = await fetch(`http://localhost:5050/orders/${params.id.toString()}`);

    if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
    }

    const order = await response.json();
    if (!order) {
        console.warn(`Order with id ${id} not found`);
        navigate("/orders");
        return;
    }
        setForm({
            OrderID: order.OrderID ?? "",
            Date: order.Date ?? "",
            Books: order.Books ?? [],
            CustID: order.CustID ?? ""
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

    if(form.OrderID && !Number.isInteger(Number(form.OrderID))){
        errors.OrderID = "OrderID must be a number"
    }

    if(!/^\d{2}\/\d{2}\/\d{4}/.test(form.Date)){
        errors.Date = "Invalid date format"
    }

    if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
    }

    const order = { ...form };
    order.OrderID = Number(order.OrderID)
    order.Rating = Number(order.Rating)

    try {
        const response = await fetch(`http://localhost:5050/orders${params.id ? "/"+params.id : ""}`, {
            method: `${params.id ? "PATCH" : "POST"}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order)
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
            OrderID: "",
            Date: "",
            Books: [],
            CustID: ""
        }
        );
        navigate("/orders");
    }
}

  return(
    <div className="container bg-white my-4 rounded rounded-3">
        <h3 className="p-3">Create/Update an Order</h3>
        <Form onSubmit={onSubmit} className="p-3">
            <div className="row my-5">
                <div className="col-6">
                    <Form.Group controlId="formOrderID">
                        <Form.Label>Order ID</Form.Label>
                        <Form.Control type="text"
                         isInvalid={!!errors.OrderID} value={form.OrderID} onChange={(e) => updateForm({OrderID: e.target.value})}/>
                         <Form.Control.Feedback type="invalid">{errors.OrderID}</Form.Control.Feedback>
                    </Form.Group>
                </div>
                <div className="col-6">
                    <Form.Group controlId="formOrderID">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="text" placeholder="Format: MM/DD/YYYY"
                         isInvalid={!!errors.Date} value={form.Date} onChange={(e) => updateForm({Date: e.target.value})}/>
                         <Form.Control.Feedback type="invalid">{errors.Date}</Form.Control.Feedback>
                    </Form.Group>
                </div>
            </div>
            <div className="row my-5">
                <div className="col-6">
                    <Form.Group controlId="formCustID">
                        <Form.Label>Customer ID</Form.Label>
                        <Select options={customerOptions} value={customerOptions.find(opt => opt.value === form.CustID) || null}
                            inputId="formCustID" onChange={(selected) => updateForm({ CustID: selected ? selected.value : "" })} isClearable
                        />
                    </Form.Group>
                </div>
                <div className="col-6">
                    <Form.Group controlId="formBooks">
                        <Form.Label>Books</Form.Label>
                        <Select isMulti options={bookOptions} value={bookOptions.filter(opt => form.Books?.includes(opt.value))}
                            inputId="formBooks" onChange={(selected) => updateForm({Books: selected ? selected.map(opt => opt.value) : [] })} isClearable
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