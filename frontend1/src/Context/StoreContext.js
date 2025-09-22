import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "https://food-order-website-backend-final.onrender.com";

  // ✅ Initialize from localStorage if available
  const [cardItem, setCardItem] = useState(() => {
    const saved = localStorage.getItem("cardItem");
    return saved ? JSON.parse(saved) : {};
  });

  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cardItem", JSON.stringify(cardItem));
  }, [cardItem]);

  // ✅ Add item to cart
  const addToCard = async (itemId) => {
    try {
      setCardItem((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));

      if (token) {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        console.warn("No token available for authentication.");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // ✅ Remove item from cart
  const removeFromCard = async (itemId) => {
    try {
      setCardItem((prev) => {
        if (!prev[itemId]) return prev; // nothing to remove
        const updated = { ...prev, [itemId]: prev[itemId] - 1 };
        if (updated[itemId] <= 0) {
          delete updated[itemId]; // ✅ clean empty items
        }
        return updated;
      });

      if (token) {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  // ✅ Calculate total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cardItem) {
      if (cardItem[itemId] > 0) {
        const itemInfo = food_list.find((product) => product._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.offerPrice * cardItem[itemId];
        }
      }
    }
    return totalAmount;
  };

  // ✅ Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data || []);
      console.log("Fetched food list:", response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // ✅ Load cart from backend if logged in
  const loadCartData = async (authToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setCardItem(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // ✅ Load initial data
  useEffect(() => {
    const init = async () => {
      await fetchFoodList();
      if (token) {
        await loadCartData(token);
      }
    };
    init();
  }, [token]);

  const contextValue = {
    food_list,
    cardItem,
    setCardItem,
    addToCard,
    removeFromCard,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
