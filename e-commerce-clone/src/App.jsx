import './App.css';
import { useState, useEffect } from "react";
import formatCurrency from "../src/utils/money";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import Home from './components/home';
import Checkout from './components/checkout';
import OrderPlace from './components/orderPlace';
import Tracking from './components/tracking';
import { getDeliveryOption } from './utils/deliveryDate';

function App() {
  // Products uses
  const [products, setProducts] = useState([]);

  class Product {
    constructor(productDetails) {
      this.id = productDetails.id;
      this.image = productDetails.image;
      this.name = productDetails.name;
      this.rating = productDetails.rating;
      this.priceCents = productDetails.priceCents;
      this.keywords = productDetails.keywords;
    }

    getStar() {
      return `/ratings/rating-${this.rating.stars * 10}.png`;
    }

    getPrice() {
      return formatCurrency(this.priceCents);
    }

    extraInfoHtml() {
      return "";
    }
  }

  class Clothing extends Product {
    constructor(productDetails) {
      super(productDetails);
      this.sizeChartLink = productDetails.sizeChartLink;
    }

    extraInfoHtml() {
      return (
        <a className="hover:text-teal-800" href={this.sizeChartLink} target="_blank">
          Size chart
        </a>
      );
    }
  }

  class Appliance extends Product {
    constructor(productDetails) {
      super(productDetails);
      this.instructionsLink = productDetails.instructionsLink;
      this.warrantyLink = productDetails.warrantyLink;
    }

    extraInfoHtml() {
      return (
        <>
          <a
            className="block text-sm hover:text-teal-800"
            href={this.instructionsLink}
            target="_blank"
          >
            Instructions
          </a>
          <a className="block text-sm hover:text-teal-800" href={this.warrantyLink} target="_blank">
            Warrenty
          </a>
        </>
      );
    }
  }

  const fetchData = async () => {
    try {
      const url = "http://localhost:5000/products";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      setProducts(
        data.map((productDetails) => {
          if (productDetails.type === "clothing") {
            return new Clothing(productDetails);
          } else if (productDetails.type === "appliance") {
            return new Appliance(productDetails);
          }
          return new Product(productDetails);
        })
      );

      console.log("load products");
    } catch (error) {
      console.log(`Loading error. please try again later. Error - ${error}`);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  // Cart uses
  class Cart {
    constructor(localStorageKey) {
      this.localStorageKey = localStorageKey;
      this.loadFromStorage();
    }

    loadFromStorage() {
      this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey)) || [];
    }

    saveToStorage() {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
    }

    addToCart(productId, productQuantity) {
      let matchingItem;

      productQuantity = isNaN(Number(productQuantity)) ? 1 : Number(productQuantity);

      this.cartItems.forEach(cartItem => {
        if (cartItem.productId === productId) {
          matchingItem = cartItem;
        }
      });

      if (matchingItem) {
        matchingItem.quantity += productQuantity;
      } else {
        this.cartItems.push({
          productId: productId,
          quantity: productQuantity,
          deliveryOptionId: "1" // set default to 1st option.
        });
      }
      this.saveToStorage();
    }

    updateCartQuantity() {
      let cartItemQuantity = 0;
      this.cartItems.forEach(cartItem => cartItemQuantity += cartItem.quantity);
      return cartItemQuantity;
    }

    updateQuantity(productId, newQuantity) {
      let matchingItem;

      this.cartItems.forEach(cartItem => {
        productId === cartItem.productId ? matchingItem = cartItem : '';
      });

      newQuantity >= 0 && newQuantity < 1000 ? matchingItem.quantity = newQuantity : '';

      this.saveToStorage();
    };

    updateDeliveryOption(deliveryOptionId, productId) {
      let matchingItem;
      this.cartItems.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });

      if (!matchingItem) {
        return;
      }

      const deliveryOption = getDeliveryOption(deliveryOptionId);
      if (!deliveryOption) {
        return;
      }
      matchingItem.deliveryOptionId = deliveryOptionId;
      this.saveToStorage();
    };

    removeFromCart(productId) {
      const newCart = [];

      this.cartItems.forEach(cartItem => {
        if (cartItem.productId !== productId) {
          newCart.push(cartItem);
        }
      });
      this.cartItems = newCart;
      this.saveToStorage();
    }

    resetCart() {
      this.cartItems = [];
      this.saveToStorage();
    }
  };
  const cart = new Cart('local-cart');

  // Matching products
  function getProduct(productId) {
    return products.find(product => product.id === productId);
  }

  return (
    <Router>
      <main>
        <Routes>
          <Route exact path='/' element={<Home products={products} cart={cart} />} />
          <Route exact path='/checkout' element={<Checkout cart={cart} getProduct={getProduct} />} />
          <Route exact path='/orderPlace' element={<OrderPlace cart={cart} getProduct={getProduct} fetchData={fetchData} />} />
          <Route exact path='/tracking' element={<Tracking cart={cart} getProduct={getProduct} />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App;
