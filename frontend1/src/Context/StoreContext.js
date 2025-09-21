import { createContext, useEffect, useState } from "react";
import axios from "axios";
// import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cardItem, setCardItem] = useState({});
    const [food_list , setFoodList] = useState([]);
    const url = "https://food-order-website-backend-final.onrender.com";
    
    const [token, setToken] = useState("");

    // Add item to cart
    const addToCard = async (itemId) => {
        try {
            if (!cardItem[itemId]) {
                setCardItem((prev) => ({ ...prev, [itemId]: 1 }));
            } else {
                setCardItem((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
            }
            if (token) {
                await axios.post(url+"/api/cart/add", {itemId},{headers:{token}}
                );
            } else {
                console.warn("No token available for authentication.");
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    // Remove item from cart
    const removeFromCard = async (itemId) => {
        setCardItem((prev) => ({ ...prev, [itemId]: Math.max(prev[itemId] - 1, 0) }));
        if (token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    };

    // Calculate total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cardItem) {
            if (cardItem[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.offerPrice * cardItem[item];
                }
            }
        }
        return totalAmount;
    };

    // Fetch food list from API
    const fetchFoodList = async () => {
        // try {
            const response = await axios.get(url+"/api/food/list");
            setFoodList(response.data.data);
            console.log("Fetched food list:", response.data.data);
        // } catch (error) {
        //     console.error("Error fetching food list:", error);
        // }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
            setCardItem(response.data.cartData);
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    };

    useEffect(()=>{
        async function loadata() {
            await fetchFoodList()
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadata();
    },[])


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
