import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import './App.css'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default App
