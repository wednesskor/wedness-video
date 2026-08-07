import { images } from "../images";

const offers = [
  {
    icon: images.cameraLinear,
    title: "촬영 구도 및 시나리오 \n사전 테스트",
  },
  {
    icon: images.rulerLinear,
    title: "장비 설치 동선 및 \n최적화 구성",
  },
  {
    icon: images.peopleOutline,
    title: "상주 인력 배치 및 \n운영 일정 조율",
  },
  {
    icon: images.familiarFace,
    title: "필요 시, 웨딩홀 내 \nVR 체험존 구축 지원",
  },
];

export default function SpecialOfferSection() {
  return (
    <section id="offer" className="bg-white py-[200px] flex justify-center">
      <div className="w-[1400px] mx-10">
        <div className="flex flex-col mb-[37px]">
          <div>
            <p className="text-[#ff682d] text-[26px] font-['SUIT',sans-serif] font-extrabold tracking-[-0.52px] uppercase mb-[22px]">
              Special Offer
            </p>
            <h2 className="text-[40px] text-black font-['SUIT',sans-serif] font-bold leading-[1.35] tracking-[-1.84px] w-[484px] mb-[30px]">
              런칭 이벤트 <br />
              2개월간 준비 기간 무료 제공
            </h2>
            <p className="text-[24px] text-black font-['SUIT',sans-serif] font-medium leading-[1.45]">
              정식 오픈 전, 웨딩홀과의 완벽한 호흡을 맞추기 위해
              <br />
              2개월간 아래 준비 과정을{" "}
              <span className="font-extrabold">무상으로 지원</span>합니다.
            </p>
          </div>

          <div className="w-full flex justify-end text-right">
            <p className="text-[26px] text-black font-['SUIT',sans-serif] font-medium leading-[1.45]">
              예비 부부는 상담 과정에서 직접 VR을 체험하게 되며,
              <br />
              이는{" "}
              <span className="font-extrabold">
                상담 전환율을 크게 향상시키는 핵심적인 요소
              </span>
              가 됩니다
            </p>
          </div>
        </div>

        {/* Offer cards */}
        <div className="grid grid-cols-4 gap-[30px]">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="bg-[#f7f7f7] rounded-[16px] h-[233px] flex flex-col items-center justify-center gap-[20px]"
            >
              <img src={offer.icon} alt="" className="w-[45px] h-[45px]" />
              <h3 className="text-[26px] text-[#1f1f1f] font-['SUIT',sans-serif] font-bold leading-[1.35] text-center tracking-[-0.78px] whitespace-pre-line">
                {offer.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
