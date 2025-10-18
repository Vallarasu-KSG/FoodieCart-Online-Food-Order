import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const List = () => {
  const url = "https://food-order-website-backend-final.onrender.com";
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('All');

  // Fetch all food items
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
        setFilteredList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      toast.error("Error fetching food list");
      console.error(error);
    }
  };

  // Remove food item
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        const newList = list.filter(item => item._id !== foodId);
        setList(newList);
        applyFilter(searchText, category, newList);
        toast.success(response.data.message);
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      toast.error("Error removing food");
      console.error(error);
    }
  };

  useEffect(() => { fetchList(); }, []);

  // Filter logic
  const applyFilter = (text, categoryFilter, baseList = list) => {
    let filtered = baseList.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    if (categoryFilter !== 'All') filtered = filtered.filter(item => item.category === categoryFilter);
    setFilteredList(filtered);
  };

  const handleSearch = (e) => { const text = e.target.value; setSearchText(text); applyFilter(text, category); };
  const handleCategory = (e) => { const selectedCategory = e.target.value; setCategory(selectedCategory); applyFilter(searchText, selectedCategory); };
  const categories = ['All', ...new Set(list.map(item => item.category))];

  return (
    <div className="admin-list">
      <h2 className="list-title">All Foods List</h2>

      {/* Search + Category Filter */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchText}
          onChange={handleSearch}
          className="search-input"
        />
        <div className="custom-select-wrapper">
          <select value={category} onChange={handleCategory} className="custom-select">
            {categories.map((cat, idx) => (<option key={idx} value={cat}>{cat}</option>))}
          </select>
        </div>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="table-wrapper">
        <table className="list-table">
          <thead>
            <tr>
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
          <tbody>
            {filteredList.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td><img src={`${url}/images/${item.image}`} alt={item.name} /></td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.price}</td>
                <td>{item.offerPrice}</td>
                <td>{item.address}</td>
                <td className="close">
                  <img onClick={() => removeFood(item._id)} src={assets.close_icon} alt="Remove" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards">
        {filteredList.map((item, index) => (
          <div className="card" key={item._id}>
            <div className="card-img"><img src={`${url}/images/${item.image}`} alt={item.name} /></div>
            <div className="card-info">
              <p><strong>No:</strong> {index + 1}</p>
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Price:</strong> {item.price}</p>
              <p><strong>Offer Price:</strong> {item.offerPrice}</p>
              <p><strong>Address:</strong> {item.address}</p>
            </div>
            <div className="card-action">
              <img onClick={() => removeFood(item._id)} src={assets.close_icon} alt="Remove" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
