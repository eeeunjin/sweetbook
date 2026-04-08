import { useEffect, useState } from 'react';
import { getBookSpecs, getTemplates } from '../api';
import LeftArrow from '../assets/icons/leftarrow.svg';
import RightArrow from '../assets/icons/rightarrow.svg';

const FALLBACK_SPECS = [
  { uid: 'PHOTOBOOK_A4_SC', name: 'A4 소프트커버 포토북', description: '210×297mm · 소프트커버 PUR 제본 · 최소 24p' },
  { uid: 'PHOTOBOOK_A5_SC', name: 'A5 소프트커버 포토북', description: '148×210mm · 소프트커버 PUR 제본 · 최소 50p' },
  { uid: 'SQUAREBOOK_HC', name: '고화질 스퀘어북 (하드커버)', description: '정사각형 · 하드커버 · 프리미엄 광택지' },
];

export default function BookSpecStep({ value, onChange, onNext, onBack }) {
  const { bookSpecUid, coverTemplateUid, contentTemplateUid } = value;
  const [specs, setSpecs] = useState(FALLBACK_SPECS);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBookSpecs(), getTemplates()])
      .then(([sRes, tRes]) => {
        const s = sRes.data?.data;
        if (Array.isArray(s) && s.length > 0) setSpecs(s);
        const t = Array.isArray(tRes.data?.data)
          ? tRes.data.data
          : Array.isArray(tRes.data)
          ? tRes.data
          : [];
        setTemplates(t);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (patch) => onChange({ ...value, ...patch });

  const coverTemplates = templates.filter((t) => t.type === 'cover' || !t.type);
  const contentTemplates = templates.filter((t) => t.type === 'content' || t.type === 'page' || !t.type);

  return (
    <div>
      <h2 className="text-2xl font-bold text-espresso mb-2">북 스펙 & 템플릿</h2>
      <p className="text-cafe-500 text-sm mb-8">북 크기와 레이아웃 템플릿을 선택하세요.</p>

      {/* Book Specs */}
      <div className="mb-8">
        <h3 className="font-medium text-espresso mb-3">
          북 스펙 <span className="text-red-400">*</span>
        </h3>
        {loading && <p className="text-cafe-400 text-sm">불러오는 중...</p>}
        <div className="space-y-2">
          {specs.map((spec) => (
            <label
              key={spec.uid}
              className={`card flex items-center gap-4 p-4 cursor-pointer border-2 transition-all ${
                bookSpecUid === spec.uid ? 'border-espresso bg-cream' : 'border-transparent hover:border-cafe-200'
              }`}
            >
              <input
                type="radio"
                name="spec"
                value={spec.uid}
                checked={bookSpecUid === spec.uid}
                onChange={() => set({ bookSpecUid: spec.uid })}
                className="accent-espresso"
              />
              <div>
                <p className="font-medium text-espresso">{spec.name || spec.uid}</p>
                <p className="text-cafe-500 text-sm">{spec.description || ''}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Template UIDs — 포털에서 확인한 UID 입력 */}
      <div className="mb-8 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium mb-1">템플릿 UID 안내</p>
          <p>
            api.sweetbook.com 파트너 포털 → 템플릿 메뉴에서 사용할 템플릿의 UID를 확인 후 입력하세요.
            비워두면 표지·내지 생성 없이 북만 생성됩니다.
          </p>
        </div>

        {templates.length > 0 && (
          <>
            <div>
              <h3 className="font-medium text-espresso mb-3">표지 템플릿</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {(coverTemplates.length ? coverTemplates : templates).slice(0, 6).map((t) => (
                  <label
                    key={t.uid}
                    className={`card p-3 cursor-pointer border-2 transition-all text-center ${
                      coverTemplateUid === t.uid ? 'border-espresso' : 'border-transparent hover:border-cafe-200'
                    }`}
                  >
                    <input type="radio" name="coverTmpl" value={t.uid} checked={coverTemplateUid === t.uid}
                      onChange={() => set({ coverTemplateUid: t.uid })} className="hidden" />
                    {t.thumbnailUrl && <img src={t.thumbnailUrl} alt={t.name} className="w-full h-20 object-cover rounded mb-1" />}
                    <p className="text-xs font-medium text-espresso truncate">{t.name || t.uid}</p>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-espresso mb-3">내지 템플릿</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                {(contentTemplates.length ? contentTemplates : templates).slice(0, 6).map((t) => (
                  <label
                    key={t.uid}
                    className={`card p-3 cursor-pointer border-2 transition-all text-center ${
                      contentTemplateUid === t.uid ? 'border-espresso' : 'border-transparent hover:border-cafe-200'
                    }`}
                  >
                    <input type="radio" name="contentTmpl" value={t.uid} checked={contentTemplateUid === t.uid}
                      onChange={() => set({ contentTemplateUid: t.uid })} className="hidden" />
                    {t.thumbnailUrl && <img src={t.thumbnailUrl} alt={t.name} className="w-full h-20 object-cover rounded mb-1" />}
                    <p className="text-xs font-medium text-espresso truncate">{t.name || t.uid}</p>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 직접 입력 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-espresso mb-1 block">표지 템플릿 UID (직접 입력)</label>
            <input
              value={coverTemplateUid || ''}
              onChange={(e) => set({ coverTemplateUid: e.target.value || undefined })}
              placeholder="예: TMPL_COVER_001"
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-espresso mb-1 block">내지 템플릿 UID (직접 입력)</label>
            <input
              value={contentTemplateUid || ''}
              onChange={(e) => set({ contentTemplateUid: e.target.value || undefined })}
              placeholder="예: TMPL_CONTENT_001"
              className="input-field text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary flex items-center gap-1">
          <img src={LeftArrow} className="w-4 h-4" /> 이전
        </button>
        <button onClick={onNext} disabled={!bookSpecUid} className="btn-primary flex items-center gap-1">
          다음: 주문 <img src={RightArrow} className="w-4 h-4 brightness-0 invert" />
        </button>
      </div>
    </div>
  );
}
