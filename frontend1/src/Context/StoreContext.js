import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const url = "https://food-order-website-backend-final.onrender.com";

  // ✅ Load cart from localStorage
  const [cardItem, setCardItem] = useState(() => {
    const saved = localStorage.getItem("cardItem");
    return saved ? JSON.parse(saved) : {};
  });

  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // ✅ Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cardItem", JSON.stringify(cardItem));
  }, [cardItem]);

  // ✅ Add item to cart
  const addToCard = async (itemId) => {
    setCardItem((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error syncing add to backend:", err);
      }
    }
  };

  // ✅ Remove one quantity of an item
  const removeFromCard = async (itemId) => {
    setCardItem((prev) => {
      if (!prev[itemId]) return prev; // nothing to remove
      const updated = { ...prev, [itemId]: prev[itemId] - 1 };
      if (updated[itemId] <= 0) delete updated[itemId]; // remove if zero
      return updated;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Error syncing remove to backend:", err);
      }
    }
  };

  // ✅ Calculate total cart amount
  const getTotalCartAmount = () => {
    return Object.entries(cardItem).reduce((total, [itemId, qty]) => {
      const item = food_list.find((f) => f._id === itemId);
      return item ? total + item.offerPrice * qty : total;
    }, 0);
  };

  // ✅ Fetch food list
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data || []);
    } catch (err) {
      console.error("Error fetching food list:", err);
    }
  };

  // ✅ Load cart from backend if user is logged in
  const loadCartData = async (authToken) => {
    if (!authToken) return;
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setCardItem(response.data.cartData || {});
    } catch (err) {
      console.error("Error loading cart data:", err);
    }
  };

  // ✅ Initialize
  useEffect(() => {
    const init = async () => {
      await fetchFoodList();
      if (token) await loadCartData(token);
    };
    init();
  }, [token]);

  return (
    <StoreContext.Provider
      value={{
        food_list,
        cardItem,
        setCardItem,
        addToCard,
        removeFromCard,
        getTotalCartAmount,
        url,
        token,
        setToken,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
