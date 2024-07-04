const orders = JSON.parse(localStorage.getItem("orders")) || [];

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}
console.log(orders);
function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

export function getOrder(orderId) {
  let matchingOrder;
  orders.find(order => order._id === orderId ? matchingOrder = order : null)
  return matchingOrder;
};
console.log(orders)

export default orders;