import { NavbarBrand } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import sakura from '../assets/sakura.png';

function ViewDropdown() {
  return (
    <NavDropdown title="View Our Collections">
        <NavDropdown.Item href="/books">Books</NavDropdown.Item>
        <NavDropdown.Item href="/authors">Authors</NavDropdown.Item>
        <NavDropdown.Item href='/customers'>Customers</NavDropdown.Item>
        <NavDropdown.Item href='/publishers'>Publishers</NavDropdown.Item>
        <NavDropdown.Item href='/reviews'>Reviews</NavDropdown.Item>
        <NavDropdown.Item href='/orders'>Orders</NavDropdown.Item>
    </NavDropdown>
  );
}

function CreateDropdown(){
  return(
    <NavDropdown title="Add to Our Collections">
      <NavDropdown.Item href="/books/create">Books</NavDropdown.Item>
      <NavDropdown.Item href='/authors/create'>Authors</NavDropdown.Item>
      <NavDropdown.Item href='/customers/create'>Customers</NavDropdown.Item>
      <NavDropdown.Item href='/publishers/create'>Publishers</NavDropdown.Item>
      <NavDropdown.Item href='/reviews/create'>Reviews</NavDropdown.Item>
      <NavDropdown.Item href='/orders/create'>Orders</NavDropdown.Item>
    </NavDropdown>
  )
}

export default function Navbar() {
  return (
    <>
    <nav className="navbar light-rg sticky-top">
      <div className="container-fluid">
        <Nav className="me-auto d-flex align-items-center">
          <NavbarBrand href="/">
            <img src={sakura} style={{ height: "100%", maxHeight: "30px", width: "auto" }}/>
            <h2 className='d-inline px-3 logo-title'>Blossom Books</h2>
          </NavbarBrand>
          <ViewDropdown/>
          <CreateDropdown/>
          <Nav.Link href='/custOrders'>Query Customer Orders</Nav.Link>
          <Nav.Link href='/bookPerf'>Query Book Performance</Nav.Link>
          <Nav.Link href='/pubInfo'>Query Publisher Information</Nav.Link>
        </Nav>
      </div>
    </nav>
    </>
  );
}