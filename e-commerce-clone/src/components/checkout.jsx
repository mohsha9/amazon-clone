import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deliveryOptions, calculateDeliveryDate, getDeliveryOption } from '../utils/deliveryDate';
import formatCurrency from '../utils/money.js';
import PaymentSummary from './checkout/paymentSummary.jsx';

function Checkout({ cart, getProduct }) {
  const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState({});
  const [inputValue, setInputValue] = useState({});
  const [isDeleteClicked, setIsDeleteClicked] = useState(null);
  const [isUpdateClicked, setIsUpdateClicked] = useState(null);
  const [isDeliveryUpdate, setIsDeliveryUpdate] = useState(null);
  const [isSaveClick, setIsSaveClick] = useState(null)

  // Set default date to free delivery in an delivery option.
  useEffect(() => {
    const defaultDeliveryOptions = {};
    cart.cartItems.forEach(item => {
      const productId = item.productId;
      if (!selectedDeliveryOptions[productId]) {
        const freeOption = deliveryOptions.find(option => option.priceCents === 0);
        defaultDeliveryOptions[productId] = freeOption ? freeOption.id : deliveryOptions[0].id;
      }
    });
    setSelectedDeliveryOptions(prevState => ({ ...prevState, ...defaultDeliveryOptions }));
  }, [cart.cartItems, deliveryOptions]);

  const handleDeliveryOptionChange = (productId, deliveryOptionId) => {
    setSelectedDeliveryOptions(prevState => ({
      ...prevState,
      [productId]: deliveryOptionId
    }));
  };

  const handleDeliveryOptionClick = (productId, deliveryOptionId) => {
    cart.updateDeliveryOption(deliveryOptionId, productId);
    setIsDeliveryUpdate(true);
  };

  const handleDeleteClick = (productId) => {
    cart.removeFromCart(productId);
    setIsDeleteClicked(true);
  };

  useEffect(() => {
    setIsSaveClick(null);
    if (isDeleteClicked) {
      setIsDeleteClicked(false);
    }
  }, [isDeleteClicked, isSaveClick]);

  const handleSaveClick = (productId) => {
    cart.updateQuantity(productId, Number(inputValue[productId] || 0));
    setIsSaveClick(true);
    setIsUpdateClicked(null);
    cart.updateCartQuantity();
  };
  
  const handleUpdateClick = (productId) => {
    setIsUpdateClicked(productId);
  };

  const handleInputChange = (productId, value) => {
    setInputValue(prevState => ({
      ...prevState,
      [productId]: value
    }));
  };

  const renderCart = cart.cartItems.map((item, i) => {
    const product = getProduct(item.productId);

    if (!product) return null;

    const deliveryOptionId = selectedDeliveryOptions[item.productId] || item.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    if (!deliveryOption)return null;

    const dateString = calculateDeliveryDate(deliveryOption);

    const renderDeliveryOption = deliveryOptions.map((option, j) => {
      const optionDateString = calculateDeliveryDate(option);
      const priceString = option.priceCents === 0 ? 'FREE' : `${formatCurrency(option.priceCents)} -`;
      const isChecked = option.id === item.deliveryOptionId;

      return (
        <div key={j} className="flex mb-3">
          <input
            type="radio"
            className="mr-1 w-5 cursor-pointer"
            checked={isChecked}
            onChange={() => handleDeliveryOptionChange(item.productId, option.id)}
            onClick={() => handleDeliveryOptionClick(item.productId, option.id)}
          />
          <div className='ml-1 flex flex-col w-[170px]'>
            <div className="text-green-700 font-semibold mb-[-2px]">
              {optionDateString}
            </div>
            <div className="text-gray-400 text-[15px]">
              {priceString} Shipping
            </div>
          </div>
        </div>
      );
    });

    return (
      <div key={i} className="mb-3 border border-gray-200 rounded-sm p-[18px]">
        <div className="font-bold text-green-700 text-[19px] mt-[5px] mb-[22px]">
          Delivery date: {dateString}
        </div>

        <div className="grid grid-cols-checkout-product-grid lg:grid-cols-checkout-product-grid2 gap-x-[30px] gap-y-[25px]">
          <img className="max-w-full max-h-[120px] mx-auto" src={product.image} alt={product.name} />

          <div className="block">
            <div className="font-bold mb-2">
              {product.name}
            </div>
            <div className="text-red-700 font-bold mb-[5px]">
              &#8377;{product.getPrice()}
            </div>
            <div className="block">
              <span>
                Quantity: <span className="text-black">{item.quantity}</span>
              </span>
              <span className={isUpdateClicked === item.productId ? "hidden" : "cart-links"} onClick={() => handleUpdateClick(item.productId)}>
                Update
              </span>

              <input value={inputValue[item.productId] || ''} className={isUpdateClicked === item.productId ? "w-[40px] border" : 'hidden'} type="number" min="0" max="1000" onChange={(e) => handleInputChange(item.productId, e.target.value)} />

              <span className={isUpdateClicked === item.productId ? "cart-links" : 'hidden'} onClick={() => handleSaveClick(item.productId)}>Save</span>

              <span className="cart-links" onClick={() => handleDeleteClick(item.productId)}>
                Delete
              </span>
            </div>
          </div>

          <div className="grid grid-cols-delivery-grid">
            <div className="font-bold mb-[10px]">
              Choose a delivery option:
            </div>
            {renderDeliveryOption}
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <header className="flex fixed top-0 left-0 right-0 h-[60px] px-[30px] bg-white justify-center z-10">
        <div className="w-full max-w-[1100px] flex items-center">
          <div>
            <Link to="/">
              <div>
                <img className="w-[100px] mt-1 sm:block hidden" src="icons/amazon-logo.png" alt="Amazon Logo" />
                <img className="sm:hidden block mt-1 h-[35px]" src="icons/amazon-mobile-logo.png" alt="Amazon Mobile Logo" />
              </div>
            </Link>
          </div>

          <div className="flex flex-1 justify-center shrink-0 text-center text-xl font-semibold">
            Checkout(<span className='text-sky-700 text-[17px]'>{cart.updateCartQuantity()} Items</span>)
          </div>

          <div className="block">
            <img src="icons/checkout-lock-icon.png" alt="Checkout Lock Icon" />
          </div>
        </div>
      </header>

      <main className="px-[30px] mt-[140px] mb-[100px] mx-auto max-w-[500px] lg:max-w-full">
        <div className="font-bold text-[22px] mb-[18px]">Review your order</div>

        <div className="grid grid-cols-checkout-grid-col2 lg:grid-cols-checkout-grid-col gap-x-[12px] items-start">
          <div>
            {renderCart}
          </div>
          <PaymentSummary
            cart={cart}
            getProduct={getProduct}
            isDeliveryUpdate={isDeliveryUpdate}
            setIsDeliveryUpdate={setIsDeliveryUpdate}
            isUpdateClicked={isUpdateClicked}
          />
        </div>
      </main>
    </>
  );
}

export default Checkout;
