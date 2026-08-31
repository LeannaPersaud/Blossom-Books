import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

export default function Publisher(){
const [form, setForm] = useState({
    PubID: "",
    PublishingHouse: "",
    City: "",
    State: "",
    Country: "",
    YearEstablished: "",
    MarketingSpend: ""
})

const params = useParams();
const navigate = useNavigate();

const [errors, setErrors] = useState({});

useEffect(() => {
async function fetchData() {
    const id = params.id?.toString() || undefined;
    if(!id) return;
    const response = await fetch(`http://localhost:5050/publishers/${params.id.toString()}`);

    if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
    }

    const publisher = await response.json();
    if (!publisher) {
        console.warn(`Publisher with id ${id} not found`);
        navigate("/publishers");
        return;
    }
        setForm({
            PubID: publisher.PubID ?? "",
            PublishingHouse: publisher.PublishingHouse ?? "",
            City: publisher.City ?? "",
            State: publisher.State ?? "",
            Country: publisher.Country ?? "",
            YearEstablished: publisher.YearEstablished ?? "",
            MarketingSpend: publisher.MarketingSpend ?? ""
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

    if (form.YearEstablished && !Number.isInteger(Number(form.YearEstablished))){
        errors.YearEstablished = "Years must be a whole number"
    }

    if(form.MarketingSpend && !Number.isFinite(Number(form.MarketingSpend))){
        errors.MarketingSpend = "Marketing spend must be a number"
    }

    if(!/^[A-Z]{3}$/.test(form.PubID)){
        errors.PubID = "Invalid PubID format"
    }

    if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
    }

    const publisher = { ...form };
    publisher.YearEstablished = Number(publisher.YearEstablished)
    publisher.MarketingSpend = Number(publisher.MarketingSpend)

    try {
        const response = await fetch(`http://localhost:5050/publishers${params.id ? "/"+params.id : ""}`, {
            method: `${params.id ? "PATCH" : "POST"}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(publisher)
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
            PubID: "",
            PublishingHouse: "",
            City: "",
            State: "",
            Country: "",
            YearEstablished: "",
            MarketingSpend: ""
        }
        );
        navigate("/publishers");
    }
}

  return(
    <div className="container bg-white my-4 rounded rounded-3">
        <h3 className="p-3">Create/Update an Publisher</h3>
        <Form onSubmit={onSubmit} className="p-3">
            <div className="row my-5">
                <div className="col-6">
                    <Form.Group controlId="formPubID">
                        <Form.Label>Publisher ID</Form.Label>
                        <Form.Control type="text" placeholder="Format: 3 capital letters"
                         isInvalid={!!errors.PubID} value={form.PubID} onChange={(e) => updateForm({PubID: e.target.value})}/>
                         <Form.Control.Feedback type="invalid">{errors.PubID}</Form.Control.Feedback>
                    </Form.Group>
                </div>
                <div className="col-6">
                    <Form.Group controlId="formHouse">
                        <Form.Label>Publishing House</Form.Label>
                        <Form.Control type="text"
                        value={form.PublishingHouse} onChange={(e) => updateForm({PublishingHouse: e.target.value})}/>
                    </Form.Group>
                </div>
            </div>
            <div className="row my-5">
                <div className="col-4">
                    <Form.Group controlId="formCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text"
                        value={form.City} onChange={(e) => updateForm({City: e.target.value})}/>
                    </Form.Group>
                </div>
                <div className="col-4">
                    <Form.Group controlId="formState">
                        <Form.Label>State</Form.Label>
                        <Form.Control type="text"
                        value={form.State} onChange={(e) => updateForm({State: e.target.value})}/>
                    </Form.Group>
                </div>
                <div className="col-4">
                    <Form.Group controlId="formCountry">
                        <Form.Label>Country</Form.Label>
                        <Form.Control type="text"
                        value={form.Country} onChange={(e) => updateForm({Country: e.target.value})}/>
                    </Form.Group>
                </div>
            </div>
            <div className="row my-5">
                <div className="col-6">
                    <Form.Group controlId="formYear">
                        <Form.Label>Year Established</Form.Label>
                        <Form.Control type="text"
                        value={form.YearEstablished} onChange={(e) => updateForm({YearEstablished: e.target.value})}/>
                    </Form.Group>
                </div>
                <div className="col-6">
                    <Form.Group controlId="formSpend">
                        <Form.Label>Marketing Spend</Form.Label>
                        <Form.Control type="text" placeholder="Omit the $"
                        value={form.MarketingSpend} onChange={(e) => updateForm({MarketingSpend: e.target.value})}/>
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