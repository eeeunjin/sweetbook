import CheckIcon from '../assets/icons/check.svg';

const steps = ['카페 정보', '메뉴 등록', '북 스펙 선택', '주문'];

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const idx = i + 1;
        const isDone = idx < current;
        const isActive = idx === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isDone
                    ? 'bg-cafe-500 text-white'
                    : isActive
                    ? 'bg-espresso text-white ring-4 ring-cafe-200'
                    : 'bg-cafe-100 text-cafe-400'
                }`}
              >
                {isDone ? <img src={CheckIcon} className="w-4 h-4 brightness-0 invert" /> : idx}
              </div>
              <span
                className={`text-xs mt-1 ${
                  isActive ? 'text-espresso font-medium' : 'text-cafe-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mb-5 mx-1 ${idx < current ? 'bg-cafe-500' : 'bg-cafe-200'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
