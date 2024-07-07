import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavNotFound from '../components/FavNotFound';
import { FaRegTrashCan } from "react-icons/fa6";
import Header from '../components/Search'
import Button from "@mui/material/Button";
import { IoIosHeart, IoMdHeartEmpty } from "react-icons/io";
import '../css/Favorites.css'
import {api} from "../vars/JwtToken"
import axios from "axios"

export default function Favorites({ product, total, money, basket, setBasket, value }) {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  

  useEffect(() => {
    const fetchThumbnail = async (productName) => {
      try {
          const res = await axios.get(`https://dummyjson.com/products/search?q=${productName}`);
          if(res.data.products.length>0){
              const thumbnail=res.data.products[0].thumbnail
              return thumbnail;
          }
      } catch (error) {
          console.error('Error fetching thumbnail:', error.message);
      }
      
  }
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtAccessToken');
        const response = await api.get("/get_all_products/", {
            headers: { "Content-Type": "application/json",
                Authorization: 'JWT ' + token,
             },
          })
        const result = await response.data
        if (result && Array.isArray(result)) {
          result.forEach(async (product) => {
            product.thumbnail=await fetchThumbnail(product.name)
           });
            setProducts(result);
        } else {
            console.error('Invalid data structure:', result);
            setProducts([]);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const favoriteIds = JSON.parse(localStorage.getItem('Favorites')) || [];
      const productsDetails = [];

      for (const id of favoriteIds) {
        const product = products.find(product => product.id === id);
        if (product) {
          productsDetails.push({
            thumbnail: product.thumbnail,
            price: product.price,
            name: product.name,
            description: product.description,
            id: product.id,
          });
        }
      }

      setProductDetails(productsDetails);
      setFavoritesCount(favoriteIds.length); 
    };

    fetchProductDetails();
  }, [products]);

  const DeleteFavorite = (productId) => {
    const favorites = JSON.parse(localStorage.getItem('Favorites')) || [];
    const updatedFavorites = favorites.filter((favId) => favId !== productId);
    localStorage.setItem('Favorites', JSON.stringify(updatedFavorites));
    setProductDetails(prevDetails => prevDetails.filter(product => product.id !== productId));
    setFavoritesCount(prevCount => prevCount - 1); 
  };

 
  const [ProductItem, setProductItem] = useState(checkIfProduct());

  function checkIfProduct(productİtemId){
    const ProductsItems = JSON.parse(localStorage.getItem('Products')) || [];
    return ProductsItems.includes(productİtemId)
  }
  
  const toggleProduct = (productId) => {
    let ProductItems = JSON.parse(localStorage.getItem('Products')) || [];
  
    const productIndex = ProductItems.findIndex(item => item.id === productId);
  
    if (productIndex === -1) {
      
      ProductItems.push({ id: productId, quantity: 1 });
    } else {
      
      ProductItems[productIndex].quantity += 1;
    }
  
    localStorage.setItem('Products', JSON.stringify(ProductItems));
    setProductItem(!ProductItem)
  
  }
console.log(products)
  return (
    <>
      <Header/>
      <div className="FavTitle">
      <h6 className="mbbb-0">Shopping Favorites <IoIosHeart className='FavHeart'/></h6>
      <div className="FavİtemCount">
        <span>You have {favoritesCount} items in your Favorites</span>
        {favoritesCount === 0 && <FavNotFound />}
      </div>
      </div>
      {productDetails.map((product, index) => (
      <div className="FavoritesContainer page-wrapper" key={index}>
        <div className="page-inner">
          <div className="row">
            <div className="el-wrapper">
              <div className="box-up">
                <img className="img" id="Favİtemİmage" src={product.thumbnail} alt="" />
                <div className="img-info">
                  <div className="info-inner">
                    <span className="p-name">{product.name}</span>
                    {/* <span className="p-company">MeMo</span> */}
                  </div>
                  <div className="a-size">{product.description}</div>
                </div>
              </div>

              <div className="box-down">
                <div className="h-bg">
                  <div className="h-bg-inner"></div>
                </div>
                <Link className="cart" onClick={() => toggleProduct(product.id)}>
                  <span className="price">${product.price}</span>
                  <span className="add-to-cart">
                    <span className="txt" >
                      <Link to="/cart" className='GoToCartLink'>Go To Cart </Link>
                      <FaRegTrashCan id="FTrash" onClick={() => DeleteFavorite(product.id)}></FaRegTrashCan>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
    </>
  );
}
