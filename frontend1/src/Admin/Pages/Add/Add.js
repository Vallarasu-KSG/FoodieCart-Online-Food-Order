import React, { useState, useEffect } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Add = () => {
    // const url = "http://localhost:4001";
    const url = "https://food-order-website-backend-final.onrender.com";
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        price: "",
        offerPrice: "",
        category: "Appam",
        address: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!data.name || !data.price || !data.offerPrice || !data.address || !image) {
            // alert("All fields are required.");
            toast.error("All fields are required.");
            return;
        }

        if (isNaN(data.price) || isNaN(data.offerPrice)) {
            toast.error("Price and Offer Price should be valid numbers.");
            // alert("Price and Offer Price should be valid numbers.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("price", Number(data.price));
            formData.append("offerPrice", Number(data.offerPrice));
            formData.append("category", data.category);
            formData.append("address", data.address);
            formData.append("image", image);

            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                setData({
                    name: "",
                    price: "",
                    offerPrice: "",
                    category: "Appam",
                    address: ""
                });
                setImage(false);
                toast.success(response.data.message)
                // alert("Product added successfully!");
            } else {
                toast.error(response.data.message)
                // toast.error("Failed to add product. Please try again.");
                // alert("Failed to add product. Please try again.");
            }
        } catch (error) {
            console.error("Error while submitting the form:", error);
            toast("An error occurred. Please check the input and try again.");
            // alert("An error occurred. Please check the input and try again.");
        }
    };

    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(image);
            }
        };
    }, [image]);

    return (
        <div className='admin-add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p className='tittle'>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_icon} 
                             style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                             alt="Upload Preview" />
                    </label>
                    <input type="file" id='image' name='image' onChange={(e) => setImage(e.target.files[0])} hidden />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product Name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='Enter Product Name' />
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Category</p>
                        <select onChange={onChangeHandler} name="category" value={data.category}>
                            <option value="Appam">Appam</option>
                            <option value="Biryani">Biryani</option>
                            <option value="Burger">Burger</option>
                            <option value="Cake">Cake</option>
                            <option value="Chinese">Chinese</option>
                            <option value="Dosa">Dosa</option>
                            <option value="Ice Cream">Ice Cream</option>
                            <option value="Idli">Idli</option>
                            <option value="Kebeb">Kebeb</option>
                            <option value="Momo">Momo</option>
                            <option value="North Indian">North Indian</option>
                            <option value="Paratha">Paratha</option>
                            <option value="Paratto">Paratto</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Pastry">Pastry</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Shawarma">Shawarma</option>
                            <option value="South Indian">South Indian</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Price</p>
                        <input onChange={onChangeHandler} value={data.price} type="text" name='price' placeholder='Enter price (e.g., 10.00)' />
                    </div>
                    <div className="add-offerPrice flex-col">
                        <p>Offer Price</p>
                        <input onChange={onChangeHandler} value={data.offerPrice} type="text" name='offerPrice' placeholder='Enter offer price (e.g., 8.00)' />
                    </div>
                </div>
                <div className="add-product-address flex-col">
                    <p>Address</p>
                    <input onChange={onChangeHandler} value={data.address} type="text" name='address' placeholder='Enter Product Address' />
                </div>
                <button type="submit" className='add-btn'>ADD</button>
            </form>
        </div>
    );
};

export default Add;
