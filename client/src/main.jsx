import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import{createBrowserRouter, RouterProvider} from "react-router-dom";

import App from "./App";
import Book from "./components/Books/Book";
import BookList from "./components/Books/BookList";
import Author from "./components/Authors/Author";
import AuthorList from "./components/Authors/AuthorList";
import CustomerOrders from "./components/Queries/CustomerOrder";
import Publisher from "./components/Publishers/Publisher";
import PublisherList from "./components/Publishers/PublisherList";
import Customer from "./components/Customers/Customer";
import CustomerList from "./components/Customers/CustomerList";
import Review from "./components/Reviews/Review";
import ReviewList from "./components/Reviews/ReviewList";
import Order from "./components/Orders/Order";
import OrderList from "./components/Orders/OrderList";
import BookPerformance from "./components/Queries/BookPerf";
import PublisherInfo from "./components/Queries/PublicationInfo";
import HomePage from "./components/Charts";

import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "books", element: <BookList /> },
      { path: "books/create", element: <Book /> },
      { path: "books/edit/:id", element: <Book /> },
      {path: "authors", element: <AuthorList />},
      {path: "authors/edit/:id", element: <Author/>},
      {path: "authors/create", element: <Author />},
      {path: "publishers", element: <PublisherList />},
      {path: "publishers/edit/:id", element: <Publisher/>},
      {path: "publishers/create", element: <Publisher />},
      {path: "customers", element: <CustomerList />},
      {path: "customers/edit/:id", element: <Customer/>},
      {path: "customers/create", element: <Customer />},
      {path: "reviews", element: <ReviewList />},
      {path: "reviews/edit/:id", element: <Review/>},
      {path: "reviews/create", element: <Review />},
      {path: "orders", element: <OrderList />},
      {path: "orders/edit/:id", element: <Order/>},
      {path: "orders/create", element: <Order />},
      { path: "custOrders", element: <CustomerOrders /> },
      { path: "bookPerf", element: <BookPerformance /> },
      { path: "pubInfo", element: <PublisherInfo /> }
    ]
  }
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);