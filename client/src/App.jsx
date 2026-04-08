import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateBookPage from './pages/CreateBookPage';
import OrdersPage from './pages/OrdersPage';
import Header from './components/Header';
import Toast from './components/Toast';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cream">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateBookPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
        <Toast />
      </div>
    </BrowserRouter>
  );
}
