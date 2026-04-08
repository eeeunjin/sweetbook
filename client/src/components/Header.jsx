import { Link, useLocation } from 'react-router-dom';
import CoffeeIcon from '../assets/icons/coffee.svg';

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="bg-espresso text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={CoffeeIcon} alt="logo" className="w-7 h-7 brightness-0 invert" />
          <div>
            <p className="text-xl font-bold leading-tight">카페 메뉴북 제작소</p>
            <p className="text-xs text-cafe-200 leading-tight">Powered by Sweetbook API</p>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to="/"
            className={`transition-colors ${pathname === '/' ? 'text-white underline font-medium' : 'opacity-70 hover:opacity-100'}`}
          >
            홈
          </Link>
          <Link
            to="/create"
            className={`transition-colors ${pathname === '/create' ? 'text-white underline font-medium' : 'opacity-70 hover:opacity-100'}`}
          >
            메뉴북 만들기
          </Link>
          <Link
            to="/orders"
            className={`transition-colors ${pathname === '/orders' ? 'text-white underline font-medium' : 'opacity-70 hover:opacity-100'}`}
          >
            주문 내역
          </Link>
        </nav>
      </div>
    </header>
  );
}
