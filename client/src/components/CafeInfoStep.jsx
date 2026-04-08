import RightArrow from '../assets/icons/rightarrow.svg';

export default function CafeInfoStep({ data, onChange, onNext }) {
  const handleChange = (e) => onChange({ ...data, [e.target.name]: e.target.value });

  const isValid = data.name && data.tagline;

  return (
    <div>
      <h2 className="text-2xl font-bold text-espresso mb-2">카페 정보 입력</h2>
      <p className="text-cafe-500 text-sm mb-8">메뉴북 표지에 들어갈 카페 정보를 입력하세요.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-espresso mb-1">
            카페 이름 <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="카페 노아"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-espresso mb-1">
            슬로건 <span className="text-red-400">*</span>
          </label>
          <input
            name="tagline"
            value={data.tagline}
            onChange={handleChange}
            placeholder="노아와 함께하는 따뜻한 한 잔"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-espresso mb-1">
            로고 이미지 URL
          </label>
          <input
            name="logoUrl"
            value={data.logoUrl}
            onChange={handleChange}
            placeholder="https://..."
            className="input-field"
          />
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt="로고 미리보기"
              className="mt-3 w-24 h-24 object-cover rounded-xl border border-cafe-200"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-espresso mb-1">테마 색상</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="themeColor"
              value={data.themeColor || '#f06b63'}
              onChange={handleChange}
              className="w-12 h-12 rounded-lg border border-cafe-200 cursor-pointer"
            />
            <span className="text-cafe-500 text-sm">{data.themeColor || '#3B1F0E'}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button onClick={onNext} disabled={!isValid} className="btn-primary">
          다음: 메뉴 등록 <img src={RightArrow} className="inline w-4 h-4 ml-1 brightness-0 invert" />
        </button>
      </div>
    </div>
  );
}
