import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

import React from "react";
import axios from "axios";
import { ProductReducer } from "../reducer/ProductReducer";
import { SiPetsathome } from "react-icons/si";

let ProductContext = createContext();
const initialState = {
  isLoading: false,
  allProducts: [],
  featuredProducts: [],
  singleProduct: {},
  isSidebarOpen: false,
};

export const ProductContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ProductReducer, initialState);

  const API = "Product.json";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API);
        dispatch({ type: "SET_ALL_PRODUCTS", payload: response.data });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (state.allProducts.length > 0) {
      dispatch({
        type: "SET_FEATURED_PRODUCT",
        payload: state.allProducts,
      });
    }
  }, [state.allProducts]);

  const getProductById = async (id) => {
    dispatch({ type: "SET_LOADING" });
    let res = await axios.get("/Product.json");
    let allProducts = res.data;
    let SingleProduct = allProducts.find((curr) => {
      return curr.id === id;
    });
    dispatch({ type: "STOP_LOADING" });
    dispatch({ type: "SET_SINGLE_PRODUCT", payload: SingleProduct });
  };

  const toggleSidebar = (value) => {
    dispatch({ type: "TOGGLE_SIDEBAR", payload: value });
  };
  return (
    <ProductContext.Provider value={{ state, getProductById, toggleSidebar }}>
      {children}
    </ProductContext.Provider>
  );
};

export default function useProductContext() {
  return useContext(ProductContext);
}
