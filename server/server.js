import express from "express";
import cors from "cors";

import books from "./routes/books.js";
import authors from "./routes/authors.js";
import customers from "./routes/customers.js"
import orders from "./routes/orders.js"
import publishers from "./routes/publishers.js"
import reviews from "./routes/reviews.js"
import queries from "./routes/queries.js"
import charts from "./routes/charts.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/books", books);
app.use("/authors", authors);
app.use("/customers", customers);
app.use("/orders", orders);
app.use("/publishers", publishers);
app.use("/reviews", reviews);
app.use("/queries", queries);
app.use("/charts", charts);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});