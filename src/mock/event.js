export const generateEvent = () => {
  return {
    type: {
      name: `Taxi`,
      category: `movement`,
    },
    destination: `Los Angeles`,
    start: `2019-03-18T10:30`,
    end: `2019-03-19T12:00`,
    price: 30,
    offers: [
      {
        name: `Order Uber`,
        price: 30,
        isChecked: true,
      },
      {
        name: `Add luggage`,
        price: 50,
        isChecked: false,
      }
    ],
    photos: [
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`,
    ],
  };
};
