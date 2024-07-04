import React, { useEffect, useState } from "react";
import { getDeliveryOption } from "../../utils/deliveryDate.js";
import formatCurrency from '../../utils/money.js';
import { Link } from "react-router-dom";
import { addOrder } from "../../utils/order.js";

let newOrderPlaced = false;

export const handleState = () => {
  return newOrderPlaced;
};

export const setHandleState = (state) => {
  newOrderPlaced = state;
};

function PaymentSummary({
  cart, getProduct,
  setIsDeliveryUpdate, isDeliveryUpdate,
  isUpdateClicked
}) {

  const [productPrice, setProductPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);


  const calculatePrices = async () => {
    let totalProductPrice = 0;
    let totalShippingPrice = 0;

    const pricePromises = cart.cartItems.map((cartItem) => {
      const product = getProduct(cartItem.productId);

      if (!product) return null;

      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
      totalProductPrice += product.getPrice() * cartItem.quantity;
      totalShippingPrice += deliveryOption.priceCents;
    });

    await Promise.all(pricePromises);
    setProductPrice(totalProductPrice);
    setShippingPrice(totalShippingPrice);
  };

  useEffect(() => {
    calculatePrices();
    if (isDeliveryUpdate) {
      setIsDeliveryUpdate(false);
    }
  }, [cart.cartItems, getProduct, isDeliveryUpdate, isUpdateClicked]);

  const totalBeforeTaxPrice = productPrice + Number(formatCurrency(shippingPrice));
  const taxPrice = totalBeforeTaxPrice * 0.1;
  const totalPrice = totalBeforeTaxPrice + taxPrice;

  const handlePlaceOrderClick = () => {
    // Make a request to the backend to create the order.
    const sendData = async () => {
      try {
        console.log("Sending data", { cartItems: cart.cartItems });
        const url = "http://localhost:5000/orders";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItems: cart.cartItems,
            totalCostPrice: formatCurrency(totalPrice),
          }),
        });
        // If the response is successful, we will get a 201 status code.
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const orders = await response.json();
        console.log("Orders placed", orders);
        addOrder(orders);
        cart.resetCart();
        setHandleState(true); // Set the new order state
      } catch (error) {
        console.error("Error placing order:", error.message);
      }
    };
    sendData();
  };

  return (
    <div className="mb-3 row-start-1 lg:row-auto pb-[5px] border p-[18px] rounded-sm">
      <div className="font-bold text-[18px] mb-3">
        Order Summary
      </div>

      <div className="payment-grid">
        <div>Items ({cart.updateCartQuantity()}):</div>
        <div className="payment-summary-money">&#8377;{productPrice}</div>
      </div>

      <div className="payment-grid">
        <div>Shipping &amp; handling:</div>
        <div className="">&#8377;{formatCurrency(shippingPrice)}</div>
      </div>

      <div className="payment-grid">
        <div>Total before tax:</div>
        <div className="payment-summary-money">&#8377;{formatCurrency(totalBeforeTaxPrice)}</div>
      </div>

      <div className="payment-grid">
        <div>Estimated tax (10%):</div>
        <div className="payment-summary-money">&#8377;{formatCurrency(taxPrice)}</div>
      </div>

      <div className="grid grid-cols-payment-grid mb-[9px] text-red-800 font-bold text-[18px] border border-t border-x-0 border-b-0 pt-4">
        <div>Order total:</div>
        <div className="text-right">&#8377;{formatCurrency(totalPrice)}</div>
      </div>

      <Link to="/orderPlace">
        <button className="w-full py-3 rounded-md mt-[11px] mb-[15px] bg-amber-300 hover:bg-amber-400 drop-shadow-md" onClick={handlePlaceOrderClick}>
          Place your order
        </button>
      </Link>
    </div>
  )
};

export default PaymentSummary;