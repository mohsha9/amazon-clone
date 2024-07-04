import dayjs from "dayjs";

export const deliveryOptions = [
  { id: "1", deliveryDays: 7, priceCents: 0 },
  { id: "2", deliveryDays: 3, priceCents: 59 },
  { id: "3", deliveryDays: 1, priceCents: 99 },
];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
  return deliveryOption;
}

function isWeekend(date) {
  const daysOfWeek = date.format("dddd");
  return daysOfWeek === "Saturday" || daysOfWeek === "Sunday";
}

export function calculateDeliveryDate(deliveryOption) {
  let remainingDays = deliveryOption.deliveryDays;
  let deliveryDate = dayjs();

  while (remainingDays > 0) {
    deliveryDate = deliveryDate.add(1, "days");

    if (!isWeekend(deliveryDate)) {
      remainingDays--;
    }
  }
  return deliveryDate.format("dddd, MMMM D YYYY");
}

export function getCurrentDate() {
  return dayjs().format("MMMM D dddd");
}
