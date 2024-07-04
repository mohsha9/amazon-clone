import { useState, useRef, useEffect } from "react";
import Header from "./header";
import { useLocation } from "react-router-dom";


function Home({ products, cart }) {

  const [btnProductId, setBtnProductId] = useState('');
  const [visibleClass, setVisibleClass] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const timeoutRef = useRef(null);
  const [filterProducts, setFilterProducts] = useState(products);
  const location = useLocation();

  useEffect(() => {
    const url = new URL(window.location.href);
    const search = url.searchParams.get('search');

    if (search) {
      const filtered = products.filter(product => {
        let matchingKeyword = false;
        product.keywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(search.toLowerCase())) {
            matchingKeyword = true;
          }
        });
        return matchingKeyword || product.name.toLowerCase().includes(search.toLowerCase());
      });
      setFilterProducts(filtered);
    } else {
      setFilterProducts(products);
    }
  }, [products, location.search]);

  const handleClick = (productId) => {
    setBtnProductId(productId);
    const selectedValue = selectedValues[productId] || '1';
    cart.addToCart(productId, selectedValue);
    setVisibleClass('added-to-cart-visible');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    };

    timeoutRef.current = setTimeout(() => {
      setVisibleClass('added-to-cart');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }, 2000);
  };

  const handleChange = (productId, value) => {
    setSelectedValues(prevValue => ({
      ...prevValue,
      [productId]: value
    }));
  };

  const product = filterProducts.map((product, i) => {
    return (
      <div key={i} id={product.id} className="flex flex-col px-[25px] pt-[40px] pb-[25px] border border-r-gray-300 border-b-gray-300">
        <div className="flex items-center justify-center h-[180px] mb-4">
          <img className="max-w-full max-h-full" src={product.image} />
        </div>
        <div className="xs:h-[60px] md:h-[40px] xs:mb-4 mb-2 leading-5">
          {product.name}
        </div>
        <div className="flex items-center mb-2">
          <img className="w-[100px] mr-1.5" src={product.getStar()} />
          <div className="cursor-pointer text-cyan-700 mt-1">
            {product.rating.count}
          </div>
        </div>
        <div className="font-bold mb-2">
          &#8377; {product.getPrice()}
        </div>
        <div className="flex justify-between mb-2">
          <select className=" text-zinc-950 bg-gray-100 border border-gray-300 h-fit py-[2px] px-[5px] rounded-lg cursor-pointer drop-shadow-md"
            onChange={(e) => handleChange(product.id, e.target.value)} value={selectedValues[product.id] || '1'}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
          </select>
          <div className="h-fit text-blue-500">
            {product.extraInfoHtml()}
          </div>
        </div>
        <div className={btnProductId === product.id ? visibleClass : 'added-to-cart'}>
          <img className="h-5 mr-1" src="icons/checkmark.png" />
          Added
        </div>
        <button className="w-full p-2 rounded-full bg-amber-300 hover:bg-amber-400 text-[14px]" onClick={() => handleClick(product.id)}>
          Add to Cart
        </button>
      </div>
    )
  });

  return (
    <>
      <Header cart={cart} products={products} />
      <main className="mt-[60px]">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {product}
        </div>
      </main>
    </>
  )
};

export default Home;