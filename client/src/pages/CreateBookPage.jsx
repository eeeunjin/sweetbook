import { useState } from 'react';
import StepIndicator from '../components/StepIndicator';
import CafeInfoStep from '../components/CafeInfoStep';
import MenuItemsStep from '../components/MenuItemsStep';
import BookSpecStep from '../components/BookSpecStep';
import OrderStep from '../components/OrderStep';
import dummyData from '../../../dummy-data/cafe-menu.json';

export default function CreateBookPage() {
  const [step, setStep] = useState(1);
  const [cafeInfo, setCafeInfo] = useState(dummyData.cafeInfo);
  const [menuItems, setMenuItems] = useState([]);
  // Sandbox 기본 템플릿 (PHOTOBOOK_A4_SC 기준 공개 템플릿)
  const [bookConfig, setBookConfig] = useState({
    bookSpecUid: 'PHOTOBOOK_A4_SC',
    coverTemplateUid: '75HruEK3EnG5',   // 표지 (A4 소프트커버 포토북)
    contentTemplateUid: '5ADDkCtrodEJ', // 내지_photo (A4)
  });

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <StepIndicator current={step} />

      {step === 1 && (
        <div className="card p-8">
          <CafeInfoStep data={cafeInfo} onChange={setCafeInfo} onNext={() => setStep(2)} />
        </div>
      )}
      {step === 2 && (
        <div className="card p-8">
          <MenuItemsStep items={menuItems} onChange={setMenuItems} onNext={() => setStep(3)} onBack={() => setStep(1)} />
        </div>
      )}
      {step === 3 && (
        <div className="card p-8">
          <BookSpecStep value={bookConfig} onChange={setBookConfig} onNext={() => setStep(4)} onBack={() => setStep(2)} />
        </div>
      )}
      {step === 4 && (
        <div className="card p-8">
          <OrderStep
            cafeInfo={cafeInfo}
            menuItems={menuItems}
            specUid={bookConfig.bookSpecUid}
            coverTemplateUid={bookConfig.coverTemplateUid}
            contentTemplateUid={bookConfig.contentTemplateUid}
            onBack={() => setStep(3)}
          />
        </div>
      )}
    </main>
  );
}
