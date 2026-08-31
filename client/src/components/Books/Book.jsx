import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Select from "react-select";

const placeholders = [613, 614, 616, 617, 618, 620, 1233, 1222, 1182, 1178, 1175, 1170, 1152, 1148, 989, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999,
     1000, 1001, 1002, 1003, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025,
     1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 751, 753, 754, 755, 756,
     757, 758, 759, 760, 762, 763, 764, 765, 766, 767, 768, 770, 771, 772, 774, 775, 776, 777, 778, 779, 780, 782, 783, 785, 788, 789, 790, 793, 794, 795,
     796, 797, 798, 799, 800, 801, 802, 803, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 826,
     828, 829, 830, 831, 832, 833, 834, 836, 837, 838, 565, 566, 567, 568, 569, 570, 571, 572, 621, 622]

export default function Book(){
const [form, setForm] = useState({
            BookID: "",
            Title: "",
            AuthID: "",
            Genre: "",
            ISBN: "",
            Format: "",
            Pages: "",
            Price: "",
            PubID: "",
            Cover: ""
})

const params = useParams();
const navigate = useNavigate();

const [errors, setErrors] = useState({});
const [authors, setAuthors] = useState([]);
const [publishers, setPublishers] = useState([]);

useEffect(() => {
    async function fetchLists() {
        try {
            const authRes = await fetch("http://localhost:5050/authors")
            const pubRes = await fetch("http://localhost:5050/publishers")

            const authData = await authRes.json();
            const pubData = await pubRes.json();

            setAuthors(authData);
            setPublishers(pubData);
        } catch (err) {
            console.error("Error fetching dropdown data:", err);
        }
    }

    fetchLists();
}, []);

const authorOptions = authors.map(a => ({
    value: a.AuthID,
    label: `${a.AuthID} - ${a.FirstName} ${a.LastName}`
}));

const publisherOptions = publishers.map(p => ({
    value: p.PubID,
    label: `${p.PubID}`
}));

useEffect(() => {
async function fetchData() {
    const id = params.id?.toString() || undefined;
    if(!id) return;
    const response = await fetch(`http://localhost:5050/books/${params.id.toString()}`);

    if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
    }

    const book = await response.json();
    if (!book) {
        console.warn(`Book with id ${id} not found`);
        navigate("/books");
        return;
    }
        setForm({
            BookID: book.BookID ?? "",
            Title: book.Title ?? "",
            AuthID: book.AuthID ?? "",
            Genre: book.Genre ?? "",
            ISBN: book.ISBN ?? "",
            Format: book.Format ?? "",
            Pages: book.Pages ?? "",
            Price: book.Price ?? "",
            PubID: book.PubID ?? "",
            Cover: book.Cover ?? ""
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

    if (form.Pages && !Number.isInteger(Number(form.Pages))){
        errors.Pages = "Pages must be a whole number"
    }

    if(form.Price && !Number.isFinite(Number(form.Price))){
        errors.Price = "Price must be a number"
    }

    if(!/^[A-Z]{2}\d{3}$/.test(form.BookID)){
        errors.BookID = "Invalid BookID format"
    }

    if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
    }

    const book = { ...form };
    book.Pages = Number(book.Pages)
    book.Price = Number(book.Price)

    if(!params.id && !book.Cover){
        book.Cover = `https://placeholdpicsum.dev/photo/id/${placeholders[Math.floor(Math.random() * placeholders.length)]}/600/400`;
    }

    try {
        const response = await fetch(`http://localhost:5050/books${params.id ? "/"+params.id : ""}`, {
            method: `${params.id ? "PATCH" : "POST"}`,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(book)
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
            Title: "",
            AuthID: "",
            Genre: "",
            ISBN: "",
            Format: "",
            Pages: "",
            Price: "",
            PubID: "",
            Cover: ""}
        );
        navigate("/books");
    }
}

  return(
    <div className="container bg-white my-4 rounded rounded-3">
        <h3 className="p-3">Create/Update a Book</h3>
        <Form onSubmit={onSubmit} className="p-3">
            <div className="row my-5">
                <div className="col-4">
                    <Form.Group controlId="formBookID">
                        <Form.Label>Book ID</Form.Label>
                        <Form.Control type="text" placeholder="Format: 2 capital letters followed by 3 numbers"
                         isInvalid={!!errors.BookID} value={form.BookID} onChange={(e) => updateForm({BookID: e.target.value})}/>
                         <Form.Control.Feedback type="invalid">{errors.BookID}</Form.Control.Feedback>
                    </Form.Group>
                </div>
                <div className="col-4">
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text"
                        value={form.Title} onChange={(e) => updateForm({Title: e.target.value})}/>
                    </Form.Group>
                </div>
                <div className="col-4">
                    <Form.Group controlId="formISBN">
                        <Form.Label>ISBN</Form.Label>
                        <Form.Control type="text" placeholder="Format: ###-#-##-######-#"
                        value={form.ISBN} onChange={(e) => updateForm({ISBN: e.target.value})}/>
                    </Form.Group>
                </div>
            </div>
            <div className="row my-5">
                <div className="col-6">
                    <Form.Group controlId="formAuthID">
                        <Form.Label>Author ID</Form.Label>
                        <Select options={authorOptions} value={authorOptions.find(opt => opt.value === form.AuthID) || null}
                            inputId="formAuthID" onChange={(selected) => updateForm({ AuthID: selected ? selected.value : "" })} isClearable
                        />
                    </Form.Group>
                </div>
                <div className="col-6">
                    <Form.Group controlId="formPubID">
                        <Form.Label>Publisher</Form.Label>
                        <Select options={publisherOptions} value={publisherOptions.find(opt => opt.value === form.PubID) || null}
                            inputId="formPubID" onChange={(selected) => updateForm({ PubID: selected ? selected.value : "" })} isClearable
                        />
                    </Form.Group>
                </div>
            </div>
            <div className="row my-5">
                <div className="col-3">
                    <Form.Group controlId="formGenre">
                        <Form.Label>Genre</Form.Label>
                        <Form.Control type="text"
                        value={form.Genre} onChange={(e) => updateForm({Genre: e.target.value})}/>
                    </Form.Group>
                </div>
                <div className="col-3">
                    <Form.Group controlId="formFormat">
                        <Form.Label>Book Format</Form.Label>
                        <Form.Control type="text"
                        value={form.Format} onChange={(e) => updateForm({Format: e.target.value})}/>
                    </Form.Group>
                </div>
                <div className="col-3">
                    <Form.Group controlId="formPages">
                        <Form.Label>Pages</Form.Label>
                        <Form.Control type="text" value={form.Pages}
                         isInvalid={!!errors.Pages} onChange={(e) => updateForm({Pages: e.target.value})}/>
                        <Form.Control.Feedback type="invalid">{errors.Pages}</Form.Control.Feedback>
                    </Form.Group>
                </div>
                <div className="col-3">
                    <Form.Group controlId="formPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" placeholder="Omit the $" value={form.Price} 
                        isInvalid={!!errors.Price} onChange={(e) => updateForm({Price: e.target.value})}/>
                        <Form.Control.Feedback type="invalid">{errors.Price}</Form.Control.Feedback>
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