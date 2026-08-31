import { Chart as ChartJS, DoughnutController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

ChartJS.register(DoughnutController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);
const colors = ["#ffdadd", "#faa3ae", "#e07c8e", "#a85068", "#754d5b", "#781820", "#4e2039", "#acd3ff", "#d0eed5" ,"#fbdfb5", "#72be9a", "#3477c5"]

function Book(props){
    return(
        <Card className="book-card d-flex flex-column h-100">
            <Card.Img variant="top" src={props.book.Cover}/>

            <Card.Body className="d-flex flex-column">
                <Card.Title>{props.book.Title}</Card.Title>
                <Card.Subtitle className="mb-2">{props.book.AuthID}</Card.Subtitle>

                <div className="mb-2">
                    Genre: <span className="badge accent-bg">{props.book.Genre}</span> <br/>
                    {props.metric}
                </div>

                <div className="book-price fs-5 mt-auto">
                    ${Number(props.book.Price).toFixed(2)}
                </div>
            </Card.Body>
        </Card>
    )
}

function DoughnutChart({dbData, label, title}){
    const data = {
        labels: dbData.map(item => ` ${item.label}`),
        datasets: [{
            label: label,
            data: dbData.map(item => item.value),
            backgroundColor: colors,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: { size: 18 }
            }
        },
        layout: {
            padding: 0
        }
    };

    return <div style={{ height: "100%", width: "100%" }}>
            <Doughnut data={data} options={options}/>
        </div>;
};

function BarChart({dbData, label, title}){
    const data = {
        labels: dbData.map(item => ` ${item.label}`),
        datasets: [{
            label: label,
            data: dbData.map(item => item.value),
            backgroundColor: colors,
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: { size: 18 }
            },
            legend: {
                display: false
            }
        },
        layout: {
            padding: 0
        }
    };

    return <div style={{ height: "100%", width: "100%" }}>
        <Bar data={data} options={options}/>
    </div>;
};

function getData(link){
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const genRes = await fetch(link)
                const genData = await genRes.json();

                setData(genData);
            } catch (err) {
                console.error("Error fetching dropdown data:", err);
            }
        }

        fetchData();
    }, [link]);

    return data
}

export default function HomePage(){
    const genreNumData = getData("http://localhost:5050/charts/genreNum")
    const genreSalesData = getData("http://localhost:5050/charts/genreSales")
    const authorReviewData = getData("http://localhost:5050/charts/authorReviews")
    const authorSalesData = getData("http://localhost:5050/charts/authorSales")
    const top5BookSales = getData("http://localhost:5050/charts/top5BookSales")
    const top5BookReviews = getData("http://localhost:5050/charts/top5BookReviews")

    return (<>
    <div className="container-fluid hero py-4 rounded rounded-2">
        <h1 className='fw-bold mx-3 mb-3 logo-title-home text-center pt-3'>Blossom Books</h1>
    </div>

    <div className="container-fluid light-bg py-4 rounded rounded-2">
        <h4 className='fw-bold mx-3 mb-3'>Top 5 Best-Selling Books</h4>
        <Row className="row-cols-2 row-cols-md-3 row-cols-lg-5">
            {top5BookSales.map((book) => (
                <Col key={book.BookID} className="mb-3 d-flex">
                    <div key={book.BookID}>
                    <Book book={book} metric={`Sales: ${book.Count}`}/>
                    </div>
                </Col>
            ))}
        </Row>
    </div>

    <div className="container-fluid light-bg py-4 rounded rounded-2">
        <h4 className='fw-bold mx-3 mb-3'>Top 5 Best Rated Books</h4>
        <Row className="row-cols-2 row-cols-md-3 row-cols-lg-5">
            {top5BookReviews.map((book) => (
                <Col key={book.BookID} className="mb-3 d-flex">
                    <div key={book.BookID}>
                    <Book book={book} metric={`Rating: ${book.AvgRating} ⭐`}/>
                    </div>
                </Col>
            ))}
        </Row>
    </div>

    <div className="container-fluid light-bg py-4 mt-3 rounded rounded-2">
        <h4 className='fw-bold mx-3 mb-3'>Popular Genres</h4>
        <div className="row justify-content-center g-4" style={{ height: "100%", width: "100%" }}>
        <div className="col-md-6 col-lg-4 mx-3">
            <div className="p-4 border rounded shadow-sm bg-white text-center d-flex flex-column" style={{ height: "350px" }}>
            <DoughnutChart dbData={genreNumData} label="Number of Books" title="Popularity of Genres based On Books Written"/>
            </div>
        </div>

        <div className="col-md-6 col-lg-4 mx-3">
            <div className="p-4 border rounded shadow-sm bg-white text-center d-flex flex-column" style={{ height: "350px" }}>
            <DoughnutChart dbData={genreSalesData} label="Number of Books" title="Popularity of Genres based On Sales"/>
            </div>
        </div>
        </div>
    </div>

    <div className="container-fluid light-bg py-4 mb-5 rounded rounded-2">
        <h4 className='fw-bold mx-3 mb-3'>Best-Selling Authors</h4>
        <div className="row justify-content-center g-4" style={{ height: "100%", width: "100%" }}>
        <div className="col-md-6 col-lg-4 mx-3">
            <div className="p-4 border rounded shadow-sm bg-white text-center d-flex flex-column" style={{ height: "350px" }}>
            <BarChart dbData={authorReviewData} label="Average Review" title="Best-Selling Authors Based on Average Ratings"/>
            </div>
        </div>

        <div className="col-md-6 col-lg-4 mx-3">
            <div className="p-4 border rounded shadow-sm bg-white text-center d-flex flex-column" style={{ height: "350px" }}>
            <BarChart dbData={authorSalesData} label="Number of Sales" title="Best-Selling Authors Based on Sales"/>
            </div>
        </div>
        </div>
    </div>
    </>);
};