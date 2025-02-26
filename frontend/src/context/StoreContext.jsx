import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:5000";
  const [token, setToken] = useState("");
  const [commodities, setCommodities] = useState([]);

  // Add item to cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) }));
    if (token) {
      await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
    }
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const item = commodities.find((commodity) => commodity._id === itemId);
      return item ? total + item.price * cartItems[itemId] : total;
    }, 0);
  };

  // Fetch commodities list from API
  const fetchCommodities = async () => {
    try {
      const response = await axios.get(`${url}/api/commodity/list`);
      setCommodities(response.data.data);
    } catch (error) {
      console.error("Error fetching commodities:", error);
    }
  };

  // Load cart data from API
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCommodities();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    };
    loadData();
  }, []);

  // Context value
  const contextValue = {
    commodities,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
