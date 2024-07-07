import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../app/Home';
import Cart from '../app/Cart';
import Favorites from '../app/Favorites';
import Categories from '../app/Categories'
import SearchBar from '../components/Search';
import Login from "../components/authentication/login.js";
import Signup from "../components/authentication/signup.js";
// import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Cart />
            </>
          }
        />
        <Route path="/favorites" element={<Favorites />} />

        <Route path="/categories" element={<Categories />} />

        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
