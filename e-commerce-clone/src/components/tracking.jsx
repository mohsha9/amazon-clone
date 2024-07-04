import { getOrder } from "../utils/order";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import Header from "./header";

function Tracking({ cart, getProduct }) {

  const url = new URL(window.location.href);
  const orderIdUrl = url.searchParams.get("orderId");
  const productIdUrl = url.searchParams.get("productId");
  const deliveryDate = url.searchParams.get('deliveryDate');

  const order = getOrder(orderIdUrl);
  const product = getProduct(productIdUrl);

  if (!product) return null;

  let productDetails;
  order.products.find(details => details.productId === product.id ? productDetails = details : null);


  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(deliveryDate);

  const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;
  const deliveryMessage = today < deliveryTime ? "Arriving on" : "Delivered";

  return (
    <>
      <Header cart={cart} />
      <main className="max-w-[850px] mt-[90px] mb-[100px] px-7 mx-auto">
        <div className="border p-5 rounded-lg">
          <Link to='/orderplace'>
            <div className="mb-7 inline-block cart-links underline">
              View all orders
            </div>
          </Link>
          <div className="text-[25px] font-bold mb-1">
            {deliveryMessage} {dayjs(deliveryDate).format('dddd, MMMM D')}
          </div>

          <div>{product.name}</div>
          <div>Quantity: {productDetails.quantity}</div>
          <img className="max-w-[150px] max-h-[150px] mt-6 mb-12" src={product.image} />

          <div className="flex justify-between text-[20px] mb-3">
            <div className={percentProgress < 50 ? 'text-green-700 text-[18px] font-bold' : 'text-[18px] font-thin'}>Preparing</div>
            <div className={percentProgress >= 50 && percentProgress < 100 ? 'text-green-700 text-[16px] font-bold' : 'text-[18px] font-thin'}>Shipped</div>
            <div className={percentProgress >= 100 ? 'text-green-700 text-[16px] font-bold' : 'text-[18px] font-thin'}>Delivered</div>
          </div>

          <div className="h-6 w-full border rounded-3xl overflow-hidden">
            <div className="h-full bg-green-700 rounded-2xl" style={{width: `${percentProgress}%`}}></div>
          </div>
        </div>
      </main>
    </>
  )
};

export default Tracking;