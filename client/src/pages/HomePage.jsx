import { Link } from 'react-router-dom';
import dummyData from '../../../dummy-data/cafe-menu.json';
import CameraIcon from '../assets/icons/camera.svg';
import BookIcon from '../assets/icons/book.svg';
import PrinterIcon from '../assets/icons/printer.svg';
import RightArrow from '../assets/icons/rightarrow.svg';

const features = [
  { icon: CameraIcon, title: '메뉴 사진 & 설명 입력', desc: '사진 URL과 메뉴 정보를 간편하게 입력하세요.' },
  { icon: BookIcon, title: '자동 메뉴북 레이아웃', desc: '카테고리별로 예쁘게 정렬된 메뉴북이 자동 생성됩니다.' },
  { icon: PrinterIcon, title: '실제 인쇄 주문', desc: 'Sweetbook API를 통해 실제 인쇄·배송까지 한 번에.' },
];

export default function HomePage() {
  const { cafeInfo, menuItems } = dummyData;
  const categories = [...new Set(menuItems.map((m) => m.category))];

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-espresso to-espresso-light text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/70 text-sm font-medium mb-4 tracking-widest uppercase">
            Sweetbook Book Print API
          </p>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            카페 메뉴북을<br />쉽고 예쁘게 만드세요
          </h1>
          <p className="text-white/85 text-lg mb-10 max-w-2xl mx-auto break-keep">
            메뉴 사진과 설명을 입력하면 인쇄 가능한 메뉴북을 자동으로 제작합니다.<br />
            사장님이 직접 만드는 나만의 카페 메뉴북.
          </p>
          <Link to="/create" className="inline-block bg-white hover:bg-cream text-espresso font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg">
            메뉴북 만들기 시작 <img src={RightArrow} className="inline w-5 h-5 ml-1" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14 text-espresso">어떻게 만드나요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="card p-8 text-center">
                <img src={f.icon} alt={f.title} className="w-10 h-10 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2 text-espresso">{f.title}</h3>
                <p className="text-cafe-600 text-sm leading-relaxed break-keep">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo: Dummy Data Preview */}
      <section className="bg-cream-dark py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-cafe-500 text-sm font-medium mb-2 tracking-wide">샘플 미리보기</p>
            <h2 className="text-3xl font-bold text-espresso">{cafeInfo.name}</h2>
            <p className="text-cafe-600 mt-2">{cafeInfo.tagline}</p>
          </div>

          {categories.map((category) => (
            <div key={category} className="mb-10">
              <h3 className="text-xl font-bold text-espresso mb-4 pb-2 border-b border-cafe-200">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems
                  .filter((m) => m.category === category)
                  .map((item) => (
                    <div key={item.id} className="card flex gap-3 p-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-espresso text-sm">{item.name}</p>
                        <p className="text-cafe-500 text-xs mt-1 line-clamp-2">{item.description}</p>
                        <p className="text-cafe-700 font-bold text-sm mt-2">
                          ₩{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          <div className="text-center mt-10">
            <Link to="/create" className="btn-primary">
              이런 메뉴북 나도 만들기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
