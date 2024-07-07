import React, { useState, useEffect } from 'react';
import Header from '../components/Search';
import Product from '../components/Product';
import Basket from '../components/Basket';
import '../css/Home.css'
import Loginİmage from '../components/Loginİmage'
import Slider from '../components/Slider';
import {api} from "../vars/JwtToken"

console.log(axios.isCancel('something'));
export default function Home() {
    const [money] = useState(100000);
    const [basket, setBasket] = useState([]);
    const [total, setTotal] = useState(0);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const resetBasket = () => {
        setBasket([]);
        setTotal(0);
    };

    const handleSearch = (searchValue) => {
        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(searchValue.toLowerCase())
        );

        setFilteredProducts(filtered);


        const uniqueCategories = Array.from(new Set(filtered.map(product => product.category)));
        setCategories(uniqueCategories);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                localStorage.setItem("jwtAccessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIwNDI4ODQ3LCJpYXQiOjE3MjAzNDI0NDcsImp0aSI6IjBkZTRkNDE1YjdmZDQzMGJiY2EwY2E0ZTA3OTFmOWQyIiwidXNlcl9pZCI6Mn0.WWZliZiGb1IsapDgfe17OBU2Of2F7BhNV_tNTZuRi0o");
                const token = localStorage.getItem('jwtAccessToken');
                
                const response = await api.get("/get_all_products/", {
                    headers: { "Content-Type": "application/json",
                        Authorization: 'JWT ' + token,
                     },
                  })
                const result = await response.data

                if (result && Array.isArray(result)) {
                    setProducts(result);
                    setFilteredProducts(result);
                    const uniqueCategories = Array.from(new Set(result.map(product => product.store.name)));
                    setCategories(uniqueCategories);

                    // filteredProducts.forEach(async (product) => {
                     
                    //  const res = await axios.get(`https://dummyjson.com/products/search?q=bag`)
                    //  const thumbnail=res.products[0].thumbnail
                    //  product.thumbnail=thumbnail
                    // });
                    // filteredProducts.forEach(async (product) => {

                    // });
                    console.log(filteredProducts)
                } else {
                    console.error('Invalid data structure:', result);
                    setProducts([]);
                    setFilteredProducts([]);
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); 

   

    return (
        <div className='Main'>
            <Header onSearch={handleSearch} />

            {total > 0 && (
                <Basket resetBasket={resetBasket} total={total} products={filteredProducts} basket={basket} />
            )}
            
           {/* <Slider slides={products.thumbnail} /> */}
           <Loginİmage/>
            <div className="categories-container">
                {categories.map(category => (
                    <div key={category} className="category-container">
                        <h2 className="category-title">{category}</h2>
                        <div className="product-container">
                            {filteredProducts
                                .filter(product => product.store.name === category)
                                .map(product => (
                                    <Product key={product.id} total={total} money={money} basket={basket} setBasket={setBasket} product={product}/>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}



