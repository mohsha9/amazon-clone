import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({ cart }) {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchText(e.target.value);
  }

  const handleClick = () => {
    navigate(`/?search=${searchText}`);
  };

  const handleKeyDown = (e) => {
    return e.key === 'Enter' ? handleClick() : ''
  };

  return (
    <header className="flex fixed items-center justify-between xs:px-4 px-2 top-0 left-0 right-0 h-[60px] bg-slate-900 text-white z-10">

      <Link to="/" className="flex items-center w-[unset] md:w-[180px]">
        <div className="inline-block header-link">
          <img className="w-[100px] mt-1 sm:block hidden" src="icons/amazon-logo-white.png" />
          <img className="sm:hidden block mt-1 h-[35px]" src="icons/amazon-mobile-logo-white.png" />
        </div>
      </Link>

      <div className="flex flex-1 max-w-[850px] mx-[10px] items-center">
        <input className="w-full px-4 py-2 rounded-md rounded-r-none text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 cursor-pointer" type="text" value={searchText} placeholder="Search"
          onChange={handleChange}
          onKeyDown={handleKeyDown} />
        <Link to={`/?search=${searchText}`}>
          <button className="flex items-center px-3 py-2 bg-amber-500 rounded-md rounded-l-none" onClick={handleClick}>
            <img className="h-6" src="icons/search-icon.png" />
          </button>
        </Link>
      </div>

      <div className="flex shrink-0 xs:w-[180px] w-fit justify-end">
        <Link to="/orderPlace">
          <div className="inline-block header-link leading-4">
            <span className="block text-[13px]">Returns</span>
            <span className="block text-[15px] font-bold">& Orders</span>
          </div>
        </Link>
        <Link to="/checkout">
          <div className="flex items-center relative header-link">
            <img className="w-[50px]" src="icons/cart-icon.png" />
            <div className="absolute top-1 left-[22px] w-[26px] text-center text-amber-500 font-bold text-4">{cart.updateCartQuantity()}</div>
            <div className="hidden xs:inline mt-3 text-[15px] font-bold">Cart</div>
          </div>
        </Link>
      </div>
    </header>
  )
};