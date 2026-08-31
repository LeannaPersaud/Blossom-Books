import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

export default function Author(){
const [form, setForm] = useState({
        AuthID: "",
        FirstName: "",
        LastName: "",
        Residence: ""
})

const params = useParams();
const navigate = useNavigate();

const [errors, setErrors] = useState({});

useEffect(() => {
async function fetchData() {
    const id = params.id?.toString() || undefined;
    if(!id) return;
    const response = await fetch(`http://localhost:5050/authors/${params.id.toString()}`);

    if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
    }

    const author = await response.json();
    if (!author) {
        console.warn(`Author with id ${id} not found`);
        navigate("/authors");
        return;
    }
        setForm({
            AuthID: author.AuthID ?? "",
            FirstName: author.FirstName ?? "",
            LastName: author.LastName ?? "",
            Residence: author.Residence ?? ""
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

    if(!/^[A-Z]{2}\d{3}$/.test(form.AuthID)){
        errors.AuthID = "Invalid AuthID format"
    }

    if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
    }

    const author = { ...form };

    try {
        const response = await fetch(`http://localhost:5050/authors${params.id ? "/"+params.id : ""}`, {
            method: `${params.id ? "PATCH" : "POST"}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(author)
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
            AuthID: "",
            FirstName: "",
            LastName: "",
            Residence: ""
        }
        );
        navigate("/authors");
    }
}

  return(
    <div className="container bg-white my-4 rounded rounded-3">
        <h3 className="p-3">Create/Update an Author</h3>
        <Form onSubmit={onSubmit} className="p-3">
            <div className="row my-5">
                <div className="col-6">
                    <Form.Group controlId="formAuthID">
                        <Form.Label>Author ID</Form.Label>
                        <Form.Control type="text" placeholder="Format: 2 capital letters followed by 3 numbers"
                         isInvalid={!!errors.AuthID} value={form.AuthID} onChange={(e) => updateForm({AuthID: e.target.value})}/>
                         <Form.Control.Feedback type="invalid">{errors.AuthID}</Form.Control.Feedback>
                    </Form.Group>
                </div>
                <div className="col-6">
                    <Form.Group controlId="formTitle">
                        <Form.Label>Country of Residence</Form.Label>
                        <Form.Control type="text"
                        value={form.Residence} onChange={(e) => updateForm({Residence: e.target.value})}/>
                    </Form.Group>
                </div>
            </div>
            <div className="row my-5">
                <div className="col-6">
                    <Form.Group controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text"
                        value={form.FirstName} onChange={(e) => updateForm({FirstName: e.target.value})}/>
                    </Form.Group>
                </div>
                <div className="col-6">
                    <Form.Group controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text"
                        value={form.LastName} onChange={(e) => updateForm({LastName: e.target.value})}/>
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