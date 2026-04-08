import { useEffect, useState } from 'react';
import { listOrders, cancelOrder } from '../api';
import { showToast } from '../components/Toast';
import MailboxIcon from '../assets/icons/mailbox.svg';
import ResetIcon from '../assets/icons/reset.svg';

function CancelModal({ onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-heavy p-8 w-full max-w-sm mx-4 text-center">
        <p className="text-lg font-bold text-espresso mb-2">주문을 취소할까요?</p>
        <p className="text-cafe-500 text-sm mb-8">취소된 주문은 되돌릴 수 없어요.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary">
            아니요
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-400 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            취소할게요
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_LABEL = {
  // 문자열 키
  PENDING: { label: '처리 중', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: '확인됨', color: 'bg-blue-100 text-blue-800' },
  PRINTING: { label: '인쇄 중', color: 'bg-purple-100 text-purple-800' },
  SHIPPED: { label: '배송 중', color: 'bg-green-100 text-green-800' },
  DELIVERED: { label: '배송 완료', color: 'bg-green-200 text-green-900' },
  CANCELLED: { label: '취소됨', color: 'bg-gray-100 text-gray-600' },
  // 숫자 코드
  10: { label: '처리 중', color: 'bg-yellow-100 text-yellow-800' },
  20: { label: '결제완료', color: 'bg-blue-100 text-blue-800' },
  30: { label: '인쇄 중', color: 'bg-purple-100 text-purple-800' },
  40: { label: '배송 중', color: 'bg-green-100 text-green-800' },
  50: { label: '배송 완료', color: 'bg-green-200 text-green-900' },
  99: { label: '취소됨', color: 'bg-gray-100 text-gray-600' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    listOrders()
      .then((res) => {
        const data = res.data?.data;
        const list = Array.isArray(data) ? data : (data?.orders || []);
        setOrders(list);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancelOrder(cancelTarget, {});
      setCancelTarget(null);
      showToast('주문이 취소되었습니다.');
      fetchOrders();
    } catch (err) {
      setCancelTarget(null);
      showToast(err.response?.data?.message || '취소 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {cancelTarget && (
        <CancelModal
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-espresso">주문 내역</h1>
          <p className="text-cafe-500 text-sm mt-1">제작 중인 메뉴북 주문 현황을 확인하세요.</p>
        </div>
        <button onClick={fetchOrders} className="btn-secondary text-sm flex items-center gap-2">
          <img src={ResetIcon} className="w-4 h-4" /> 새로고침
        </button>
      </div>

      {loading && (
        <div className="text-center py-20 text-cafe-400">
          <img src={MailboxIcon} alt="loading" className="w-10 h-10 mx-auto mb-3 animate-spin" />
          <p className="text-sm">주문 내역을 불러오는 중...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-cafe-400 text-xs mt-2">API Key가 올바른지 확인하세요.</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="card p-16 text-center text-cafe-400">
          <img src={MailboxIcon} alt="mailbox" className="w-16 h-16 mx-auto mb-4" />
          <p className="font-medium mb-2">아직 주문이 없습니다.</p>
          <p className="text-sm mb-6">메뉴북을 만들고 첫 번째 주문을 해보세요!</p>
          <a href="/create" className="btn-primary inline-block">메뉴북 만들기</a>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusKey = order.orderStatus ?? order.status;
            const status = STATUS_LABEL[statusKey] || { label: order.orderStatusDisplay || statusKey, color: 'bg-gray-100 text-gray-600' };
            return (
              <div key={order.uid || order.orderUid} className="card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="font-mono text-xs text-cafe-400">
                        #{order.uid || order.orderUid}
                      </span>
                    </div>
                    <p className="font-medium text-espresso">
                      {order.bookTitle || '메뉴북'} × {order.quantity || order.itemCount || 1}부
                    </p>
                    {order.shippingAddress && (
                      <p className="text-cafe-500 text-sm mt-1">
                        {order.shippingAddress.address}
                      </p>
                    )}
                    {order.createdAt && (
                      <p className="text-cafe-400 text-xs mt-1">
                        {new Date(order.createdAt).toLocaleString('ko-KR')}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {(order.totalPrice || order.totalAmount) && (
                      <p className="font-bold text-espresso">
                        ₩{Number(order.totalPrice || order.totalAmount).toLocaleString()}
                      </p>
                    )}
                    {(statusKey === 10 || statusKey === 20 || statusKey === 'PENDING' || statusKey === 'CONFIRMED') ? (
                      <button
                        onClick={() => setCancelTarget(order.uid || order.orderUid)}
                        className="mt-2 text-xs text-red-400 hover:text-red-600 underline"
                      >
                        취소
                      </button>
                    ) : null}
                  </div>
                </div>
                {order.trackingNumber && (
                  <div className="mt-3 pt-3 border-t border-cafe-100 text-sm text-cafe-500">
                    배송 추적 번호: <span className="font-mono">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
