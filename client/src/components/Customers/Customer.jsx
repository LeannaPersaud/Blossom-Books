import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

export default function Customer(){
const [form, setForm] = useState({
    CustID: "",
    Name: "",
    Phone: ""
})

const params = useParams();
const navigate = useNavigate();

const [errors, setErrors] = useState({});

useEffect(() => {
async function fetchData() {
    const id = params.id?.toString() || undefined;
    if(!id) return;
    const response = await fetch(`http://localhost:5050/customers/${params.id.toString()}`);

    if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
    }

    const customer = await response.json();
    if (!customer) {
        console.warn(`Customer with id ${id} not found`);
        navigate("/customers");
        return;
    }
        setForm({
            CustID: customer.CustID ?? "",
            Name: customer.Name ?? "",
            Phone: customer.Phone ?? ""
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

    if(!/^[A-Z]{2}\d{3}$/.test(form.CustID)){
        errors.CustID = "Invalid CustID format"
    }

    if(!/^[1-9]\d{2}-\d{3}-\d{4}/.test(form.Phone)){
        errors.Phone = "Invalid phone format"
    }

    if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
    }

    const customer = { ...form };

    try {
        const response = await fetch(`http://localhost:5050/customers${params.id ? "/"+params.id : ""}`, {
            method: `${params.id ? "PATCH" : "POST"}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(customer)
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
            CustID: "",
            Name: "",
            Phone: ""
        }
        );
        navigate("/customers");
    }
}

  return(
    <div className="container bg-white my-4 rounded rounded-3">
        <h3 className="p-3">Create/Update an Customer</h3>
        <Form onSubmit={onSubmit} className="p-3">
            <div className="row my-5">
                <div className="col-4">
                    <Form.Group controlId="formCustID">
                        <Form.Label>Customer ID</Form.Label>
                        <Form.Control type="text" placeholder="Format: 2 capital letters followed by 3 numbers"
                         isInvalid={!!errors.CustID} value={form.CustID} onChange={(e) => updateForm({CustID: e.target.value})}/>
                         <Form.Control.Feedback type="invalid">{errors.CustID}</Form.Control.Feedback>
                    </Form.Group>
                </div>
                <div className="col-4">
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text"
                        value={form.Name} onChange={(e) => updateForm({Name: e.target.value})}/>
                    </Form.Group>
                </div>
                <div className="col-4">
                    <Form.Group controlId="formPhone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" value={form.Phone}
                        isInvalid={!!errors.Phone} onChange={(e) => updateForm({Phone: e.target.value})}/>
                        <Form.Control.Feedback type="invalid">{errors.Phone}</Form.Control.Feedback>
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