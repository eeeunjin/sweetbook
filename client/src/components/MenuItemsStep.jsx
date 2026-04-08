import { useState } from 'react';
import dummyData from '../../../dummy-data/cafe-menu.json';
import LeftArrow from '../assets/icons/leftarrow.svg';
import RightArrow from '../assets/icons/rightarrow.svg';
import ForkKnife from '../assets/icons/forkknife.svg';

const emptyItem = { name: '', category: '', description: '', price: '', imageUrl: '' };

export default function MenuItemsStep({ items, onChange, onNext, onBack }) {
  const [form, setForm] = useState(emptyItem);
  const [editIdx, setEditIdx] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = () => {
    if (!form.name || !form.category || !form.price) return;
    if (editIdx !== null) {
      const updated = [...items];
      updated[editIdx] = { ...form, id: items[editIdx].id };
      onChange(updated);
      setEditIdx(null);
    } else {
      onChange([...items, { ...form, id: Date.now() }]);
    }
    setForm(emptyItem);
    setShowForm(false);
  };

  const handleEdit = (idx) => {
    setForm(items[idx]);
    setEditIdx(idx);
    setShowForm(true);
  };

  const handleDelete = (idx) => onChange(items.filter((_, i) => i !== idx));

  const handleLoadDummy = () => {
    onChange(dummyData.menuItems);
  };

  const categories = [...new Set(items.map((m) => m.category))];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-espresso flex items-center gap-2">
          <img src={ForkKnife} className="w-6 h-6" /> 메뉴 등록
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleLoadDummy}
            className="text-sm border border-cafe-300 text-cafe-600 px-4 py-2 rounded-lg hover:bg-cream-dark transition-colors"
          >
            샘플 불러오기
          </button>
          <button
            onClick={() => { setForm(emptyItem); setEditIdx(null); setShowForm(true); }}
            className="btn-primary text-sm"
          >
            + 메뉴 추가
          </button>
        </div>
      </div>
      <p className="text-cafe-500 text-sm mb-6">
        메뉴를 {items.length}개 등록했습니다. 최소 1개 이상 필요합니다.
      </p>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card p-6 mb-6 border-2 border-cafe-300">
          <h3 className="font-medium text-espresso mb-4">
            {editIdx !== null ? '메뉴 수정' : '새 메뉴 추가'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-espresso mb-1 block">
                메뉴명 *
              </label>
              <input name="name" value={form.name} onChange={handleFormChange} placeholder="카페 라떼" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium text-espresso mb-1 block">
                카테고리 *
              </label>
              <input name="category" value={form.category} onChange={handleFormChange} placeholder="커피" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium text-espresso mb-1 block">
                가격 (원) *
              </label>
              <input name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="5500" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium text-espresso mb-1 block">
                이미지 URL
              </label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleFormChange} placeholder="https://..." className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-espresso mb-1 block">
                설명
              </label>
              <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="메뉴 설명을 입력하세요" rows={2} className="input-field resize-none" />
            </div>
          </div>
          {form.imageUrl && (
            <img src={form.imageUrl} alt="미리보기" className="mt-3 w-20 h-20 object-cover rounded-lg border border-cafe-200" onError={(e) => { e.target.style.display = 'none'; }} />
          )}
          <div className="flex gap-2 mt-4">
            <button onClick={handleAdd} disabled={!form.name || !form.category || !form.price} className="btn-primary text-sm">
              {editIdx !== null ? '수정 완료' : '추가'}
            </button>
            <button onClick={() => { setShowForm(false); setEditIdx(null); setForm(emptyItem); }} className="btn-secondary text-sm">
              취소
            </button>
          </div>
        </div>
      )}

      {/* Menu List by Category */}
      {items.length === 0 ? (
        <div className="card p-12 text-center text-cafe-400">
          <img src={ForkKnife} alt="menu" className="w-12 h-12 mx-auto mb-3" />
          <p>아직 메뉴가 없습니다. 추가하거나 샘플을 불러오세요.</p>
        </div>
      ) : (
        categories.map((cat) => (
          <div key={cat} className="mb-6">
            <h3 className="font-medium text-cafe-700 text-sm uppercase tracking-wide mb-2">
              {cat} ({items.filter((m) => m.category === cat).length})
            </h3>
            <div className="space-y-2">
              {items
                .map((item, idx) => ({ item, idx }))
                .filter(({ item }) => item.category === cat)
                .map(({ item, idx }) => (
                  <div key={item.id} className="card flex items-center gap-3 p-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" onError={(e) => { e.target.src = 'https://via.placeholder.com/56x56/f9edd9/6B4C3B?text=No+IMG'; }} />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-cafe-100 flex items-center justify-center text-cafe-300 text-xs flex-shrink-0">
                        No IMG
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-espresso text-sm">{item.name}</p>
                      <p className="text-cafe-400 text-xs truncate">{item.description}</p>
                    </div>
                    <p className="text-cafe-700 font-bold text-sm whitespace-nowrap">
                      ₩{Number(item.price).toLocaleString()}
                    </p>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => handleEdit(idx)} className="text-xs text-cafe-500 hover:text-espresso px-2 py-1 rounded hover:bg-cafe-50 transition-colors">수정</button>
                      <button onClick={() => handleDelete(idx)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors">삭제</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))
      )}

      <div className="mt-10 flex justify-between">
        <button onClick={onBack} className="btn-secondary flex items-center gap-1">
          <img src={LeftArrow} className="w-4 h-4" /> 이전
        </button>
        <button onClick={onNext} disabled={items.length === 0} className="btn-primary flex items-center gap-1">
          다음: 북 스펙 선택 <img src={RightArrow} className="w-4 h-4 brightness-0 invert" />
        </button>
      </div>
    </div>
  );
}
