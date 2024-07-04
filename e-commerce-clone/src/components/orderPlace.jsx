import { useEffect, useState } from "react";
import Header from "./header";
import orders from "../utils/order";
import dayjs from "dayjs";
import { handleState, setHandleState } from "./checkout/paymentSummary";
import { Link } from "react-router-dom";
import { calculateDeliveryDate, getDeliveryOption } from "../utils/deliveryDate";

function OrderPlace({ cart, getProduct, fetchData }) {
  const [orderDetails, setOrderDetails] = useState([]);
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const [buttonText, setButtonText] = useState({});

  // Check for new order state
  useEffect(() => {
    const state = handleState();
    setHasNewOrder(state);
  }, []);

  const fetchOrderDetails = async () => {
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const products = await Promise.all(
          order.products.map(async (product) => {
            const productDetails = await getProduct(product.productId);
            return { ...product, ...productDetails };
          })
        );
        return { ...order, products };
      })
    );
    setOrderDetails(ordersWithDetails);
  };

  useEffect(() => {
    const load = async () => {
      await fetchData();
      await fetchOrderDetails();
    }
    load();
  }, []);

  useEffect(() => {
    if (hasNewOrder) {
      setHandleState(false);
      setHasNewOrder(false);
    }
  }, [hasNewOrder]);


  const handleBuyClick = (productId) => {
    cart.addToCart(productId);

    const defaultText = 'Buy it again';
    setButtonText(prevState => ({
      ...prevState,
      [productId]: 'Added!'
    }));

    setTimeout(() => {
      setButtonText(prevState => ({
        ...prevState,
        [productId]: defaultText
      }));
    }, 1000);
  };


  const renderPlacedOrder = orderDetails.map((orderProductDetails, i) => {
    const orderTimeString = dayjs(orderProductDetails.orderTime).format("MMMM D");

    let renderProduct;

    if (Array.isArray(orderProductDetails.products)) {
      renderProduct = orderProductDetails.products.map((product, j) => {

        // texting : only image and name disappear
        // console.log(product.image);
        // console.log(product.name);

        const deliveryoption = getDeliveryOption(product.deliveryOptionId);
        const getDeliveryDate = calculateDeliveryDate(deliveryoption);

        return (
          <div key={j} className="grid grid-cols-[1fr] xs:grid-cols-[110px,1fr] md:grid-cols-[110px,1fr,220px] gap-x-8 pb-[8px] py-[30px] px-[25px]"
          >
            <div className="flex justify-center text-center">
              <img className="max-w-[110px] max-h-[110px]" src={product.image} />
            </div>
            <div className="product-details">
              <div className="md:mb-[10px] mb-[5px] font-bold">{product.name}</div>
              <div>Arriving on: {getDeliveryDate}</div>
              <div className="md:mb-[15px] mb-[8px]">Quantity: {product.quantity}</div>
              <button className="text-[15px] w-full xs:w-[140px] mb-[10px] h-[36px] rounded-lg flex items-center justify-center bg-amber-300 hover:bg-amber-400 border border-amber-400 cursor-pointer shadow-md" onClick={(e) => handleBuyClick(product.productId, e)}>
                <img className="w-[25px] mr-[15px]" src="/icons/buy-again.png" />
                <span className="buy-again-message">{buttonText[product.productId] || 'Buy it again'}</span>
              </button>
            </div>
            <div className="col-auto mb-[10px] xs:col-[2] md:col-[3] self-start">
              <Link to={`/tracking?orderId=${orderProductDetails._id}&productId=${product.productId}&deliveryDate=${getDeliveryDate}`}>
                <button className="w-full p-2.5 xs:w-[140px] md:w-full text-[15px] md:p-2 bg-slate-50 hover:bg-slate-100 border rounded-lg cursor-pointer shadow-lg">
                  Track package
                </button>
              </Link>
            </div>
          </div>
        );
      });
    } else {
      console.log("Order ID -", orderProductDetails.id, "has no products.");
    }

    return (
      <div key={i}>
        <div className="order-container">
          <div className="flex-col xs1:flex-row items-start leading-6 p-4 bg-gray-100 border flex xs1:items-center justify-between xs1:px-[25px] xs1:py-[20px] rounded-lg rounded-b-none">
            <div className="flex xs1:flex-row flex-col shrink-0">
              <div className="grid grid-cols-[auto,1fr] xs1:grid-cols-none mr-0 xs1:mr-[45px]">
                <div className="mr-[5px] md:mr-0 font-semibold">Order Placed:</div>
                <div>{orderTimeString}</div>
              </div>
              <div className="grid grid-cols-[auto,1fr] xs1:grid-cols-none mr-0 xs1:mr-[45px]">
                <div className="mr-[5px] md:mr-0 font-semibold">Total:</div>
                <div className="text-red-800 font-semibold">&#8377; {orderProductDetails.totalCostPrice}</div>
              </div>
            </div>
            <div className="grid grid-cols-[auto,1fr] xs1:grid-cols-none mr-0 xs1:mr-[45px]">
              <div className="mr-[5px] md:mr-0 font-semibold">Order ID:</div>
              <div>{orderProductDetails._id}</div>
            </div>
          </div>

          {/*Section 2*/}
          <div className="border border-t-0 rounded-lg rounded-t-none mb-4">{renderProduct}</div>
        </div>
      </div>
    );
  });

  return (
    <>
      <Header cart={cart} />
      <main className="max-w-[850px] mt-[90px] mb-[100px] px-[20px] mx-auto">
        <div className="font-bold text-[26px] mb-[25px]">Your Orders</div>
        <div className="grid grid-cols-[1fr] gap-x-[50px]">{renderPlacedOrder}</div>
      </main>
    </>
  );
}

export default OrderPlace;
