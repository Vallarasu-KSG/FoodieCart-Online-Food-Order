import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const List = () => {
  // const url = "http://localhost:4001";
  const url = "https://food-order-website-backend-final.onrender.com";
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      toast.error("Error fetching food list");
      console.error(error);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        // Remove item from the list without re-fetching
        setList(prevList => prevList.filter(item => item._id !== foodId));
        toast.success(response.data.message);
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("Error removing food");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
      <div className='admin-list admin-add admin-flex-col'>
        <p>All Foods List</p>
        <table className="list-table">
          <thead className="scrollable-rows">
            <tr className="list-table-formet titles">
              <th>No.</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Offer Price</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="scrollable-rows">
            {list.map((item, index) => (
              <tr key={index} className="list-table-format tttt">
                <td>{index + 1}</td>
                <td><img src={`${url}/images/${item.image}`} alt={item.name} /></td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.price}</td>
                <td>{item.offerPrice}</td>
                <td>{item.address}</td>
                <td className='close'>
                  <img onClick={() => removeFood(item._id)} src={assets.close_icon} alt="Remove" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    
};

export default List;
