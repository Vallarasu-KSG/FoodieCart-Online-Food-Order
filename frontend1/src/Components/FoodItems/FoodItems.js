import React, { useState, useContext, useEffect } from "react";
import "./FoodItems.css";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { AiOutlinePlus, AiOutlineMinus, AiFillHeart } from "react-icons/ai";
import axios from "axios";

const FoodItems = ({ id, name, image, price, offerPrice, category, address }) => {
  const { cardItem, addToCard, removeFromCard, setCardItem, token } = useContext(StoreContext);
  const [hotCount, setHotCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  const url = "https://food-order-website-backend-final.onrender.com";

  // Fetch likes & liked status
  useEffect(() => {
    const fetchLikes = async () => {
      if (!token) return; // skip if not logged in
      try {
        const res = await axios.get(`${url}/api/likes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHotCount(res.data.totalLikes || 0);
        setLiked(res.data.liked || false);
      } catch (err) {
        console.error("Failed to fetch likes:", err);
      }
    };
    fetchLikes();
  }, [id, token]);

  const handleHeartToggle = async () => {
    if (!token) {
      alert("Please login to like items.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${url}/api/like`,
        { itemId: id, itemName: name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);

      setHotCount(res.data.totalLikes || 0);
      setLiked(res.data.liked);
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyItem = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const hiddenSections = document.querySelectorAll(".hidden-section");
    hiddenSections.forEach((section) => section.classList.add("show-section"));
    setCardItem({});
    addToCard(id);
    navigate("/buyPage");
  };

  return (
    <div className="food-items">
      <div className="food-item-image-container">
        <img className="food-item-image" src={`${url}/images/${image}`} alt={name} />
        {!cardItem?.[id] ? (
          <AiOutlinePlus className="add1" onClick={() => addToCard(id)} size={22} />
        ) : (
          <div className="food-item-counter">
            <AiOutlineMinus className="remove-icon" onClick={() => removeFromCard(id)} size={22} />
            <p>{cardItem?.[id]}</p>
            <AiOutlinePlus className="add-icon" onClick={() => addToCard(id)} size={22} />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-name-heart">
          <p>{name}</p>
          <div className="heart-section" onClick={handleHeartToggle}>
            <AiFillHeart className={`heart-icon ${liked ? "liked" : ""}`} />
            <span className={`heart-count ${animate ? "animate" : ""}`}>{hotCount}</span>
          </div>
        </div>
        <p className="food-item-price">
          <del>₹{price}</del> / ₹{offerPrice}
        </p>
        <p className="food-item-category">
          {category}, {address}
        </p>
        <button className="buy-btn" onClick={handleBuyItem}>
          Buy Item
        </button>
        {loading && <p>Submitting...</p>}
      </div>
    </div>
  );
};

export default FoodItems;
