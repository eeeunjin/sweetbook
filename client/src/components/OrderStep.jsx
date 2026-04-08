import { useState } from 'react';
import { buildMenuBook, estimateOrder, createOrder } from '../api';
import LeftArrow from '../assets/icons/leftarrow.svg';
import RightArrow from '../assets/icons/rightarrow.svg';
import MailboxIcon from '../assets/icons/mailbox.svg';
import ConfettiIcon from '../assets/icons/confetti.svg';

export default function OrderStep({ cafeInfo, menuItems, specUid, coverTemplateUid, contentTemplateUid, onBack }) {
  const [form, setForm] = useState({
    recipientName: '',
    recipientPhone: '',
    postalCode: '',
    address1: '',
    address2: '',
    shippingMemo: '',
    quantity: 1,
  });
  const [phase, setPhase] = useState('form'); // form | building | estimating | confirming | ordering | done | error
  const [estimate, setEstimate] = useState(null);
  const [bookUid, setBookUid] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBuildAndEstimate = async () => {
    if (!form.recipientName || !form.address1 || !form.postalCode) return;
    try {
      // 1. 메뉴북 빌드
      setPhase('building');
      const buildRes = await buildMenuBook({
        cafeInfo,
        menuItems,
        bookSpecUid: specUid,
        coverTemplateUid: coverTemplateUid || undefined,
        contentTemplateUid: contentTemplateUid || undefined,
      });
      const uid = buildRes.data?.data?.bookUid;
      setBookUid(uid);

      // 2. 견적
      setPhase('estimating');
      const estRes = await estimateOrder({
        items: [{ bookUid: uid, quantity: Number(form.quantity) }],
      });
      setEstimate(estRes.data?.data || estRes.data);
      setPhase('confirming');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
      setPhase('error');
    }
  };

  const handleOrder = async () => {
    setPhase('ordering');
    try {
      const res = await createOrder({
        items: [{ bookUid, quantity: Number(form.quantity) }],
        shipping: {
          recipientName: form.recipientName,
          recipientPhone: form.recipientPhone,
          postalCode: form.postalCode,
          address1: form.address1,
          address2: form.address2,
          shippingMemo: form.shippingMemo,
        },
        externalRef: `cafe-menu-${Date.now()}`,
      });
      setOrderResult(res.data?.data || res.data);
      setPhase('done');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
      setPhase('error');
    }
  };

  if (phase === 'done') {
    return (
      <div className="text-center py-16">
        <img src={ConfettiIcon} alt="완료" className="w-16 h-16 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-espresso mb-3">주문 완료!</h2>
        <p className="text-cafe-500 mb-2">{cafeInfo.name} 메뉴북 주문이 접수되었습니다.</p>
        {(orderResult?.orderUid || orderResult?.uid) && (
          <p className="text-sm text-cafe-400 mt-2">
            주문 번호: <span className="font-mono">{orderResult.orderUid || orderResult.uid}</span>
          </p>
        )}
        <a href="/orders" className="inline-flex items-center gap-2 mt-8 btn-primary">
          <img src={MailboxIcon} className="w-4 h-4 brightness-0 invert" /> 주문 내역 확인
        </a>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4 text-red-400 font-bold">!</div>
        <h2 className="text-2xl font-bold text-espresso mb-3">오류가 발생했습니다</h2>
        <p className="text-cafe-500 text-sm bg-red-50 rounded-lg p-4 max-w-md mx-auto">{errorMsg}</p>
        <button onClick={() => setPhase('form')} className="mt-6 btn-secondary">다시 시도</button>
      </div>
    );
  }

  if (phase === 'building' || phase === 'estimating' || phase === 'ordering') {
    const messages = {
      building: '메뉴북을 제작 중입니다...',
      estimating: '견적을 계산 중입니다...',
      ordering: '주문을 접수 중입니다...',
    };
    return (
      <div className="text-center py-20">
        <img src={MailboxIcon} alt="loading" className="w-16 h-16 mx-auto mb-6 animate-bounce" />
        <h2 className="text-2xl font-bold text-espresso mb-2">{messages[phase]}</h2>
        <p className="text-cafe-400 text-sm">Sweetbook API와 통신 중입니다. 잠시만 기다려 주세요.</p>
      </div>
    );
  }

  if (phase === 'confirming') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-espresso mb-2">주문 확인</h2>
        <p className="text-cafe-500 text-sm mb-8">아래 내용을 확인하고 주문을 완료하세요.</p>
        <div className="space-y-3 mb-8">
          <Row label="카페명" value={cafeInfo.name} />
          <Row label="메뉴 수" value={`${menuItems.length}개`} />
          <Row label="북 스펙" value={specUid} />
          <Row label="수량" value={`${form.quantity}부`} />
          <Row label="받는 분" value={form.recipientName} />
          {form.recipientPhone && <Row label="연락처" value={form.recipientPhone} />}
          <Row label="배송지" value={`[${form.postalCode}] ${form.address1} ${form.address2}`} />
          {form.shippingMemo && <Row label="배송 메모" value={form.shippingMemo} />}
          {estimate && (
            <>
              <hr className="border-cafe-100" />
              {estimate.productPrice !== undefined && (
                <Row label="제작비" value={`₩${Number(estimate.productPrice).toLocaleString()}`} />
              )}
              {estimate.shippingFee !== undefined && (
                <Row label="배송비" value={`₩${Number(estimate.shippingFee).toLocaleString()}`} />
              )}
              {estimate.totalPrice !== undefined && (
                <Row label="합계" value={`₩${Number(estimate.totalPrice).toLocaleString()}`} highlight />
              )}
            </>
          )}
        </div>
        <div className="flex justify-between">
          <button onClick={() => setPhase('form')} className="btn-secondary flex items-center gap-1">
            <img src={LeftArrow} className="w-4 h-4" /> 수정
          </button>
          <button onClick={handleOrder} className="btn-primary flex items-center gap-1">
            주문 확정 <img src={RightArrow} className="w-4 h-4 brightness-0 invert" />
          </button>
        </div>
      </div>
    );
  }

  // form
  const isValid = form.recipientName && form.address1 && form.postalCode;

  return (
    <div>
      <h2 className="text-2xl font-bold text-espresso mb-2">배송 정보 입력</h2>
      <p className="text-cafe-500 text-sm mb-6">완성된 메뉴북을 받을 주소를 입력하세요.</p>

      <div className="bg-cream-dark rounded-xl p-4 mb-6 text-sm">
        <p className="font-medium text-espresso mb-1">주문 요약</p>
        <p className="text-cafe-600">{cafeInfo.name} 메뉴북 · {menuItems.length}개 메뉴 · {specUid}</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-espresso mb-1 block">받는 분 *</label>
            <input name="recipientName" value={form.recipientName} onChange={handleChange} placeholder="홍길동" className="input-field" />
          </div>
          <div>
            <label className="text-xs font-medium text-espresso mb-1 block">연락처</label>
            <input name="recipientPhone" value={form.recipientPhone} onChange={handleChange} placeholder="010-0000-0000" className="input-field" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-espresso mb-1 block">우편번호 *</label>
          <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="06234" className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-espresso mb-1 block">주소 *</label>
          <input name="address1" value={form.address1} onChange={handleChange} placeholder="서울시 강남구 테헤란로 123" className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-espresso mb-1 block">상세 주소</label>
          <input name="address2" value={form.address2} onChange={handleChange} placeholder="4층" className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-espresso mb-1 block">배송 메모</label>
          <input name="shippingMemo" value={form.shippingMemo} onChange={handleChange} placeholder="부재 시 경비실 맡겨주세요" className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-espresso mb-1 block">수량</label>
          <select name="quantity" value={form.quantity} onChange={handleChange} className="input-field">
            {[1, 2, 3, 5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}부</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="btn-secondary flex items-center gap-1">
          <img src={LeftArrow} className="w-4 h-4" /> 이전
        </button>
        <button onClick={handleBuildAndEstimate} disabled={!isValid} className="btn-primary flex items-center gap-1">
          메뉴북 제작 & 견적 확인 <img src={RightArrow} className="w-4 h-4 brightness-0 invert" />
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-cafe-500">{label}</span>
      <span className={`font-medium ${highlight ? 'text-espresso text-base font-bold' : 'text-espresso'}`}>{value}</span>
    </div>
  );
}
