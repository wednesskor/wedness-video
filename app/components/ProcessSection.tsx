import { images } from "../images";

const processes = [
  {
    step: "01",
    title: "사전 면담 진행",
    description:
      "VR 웨딩 영상 \n서비스 소개 및 \n당일 동선 점검",
  },
  {
    step: "02",
    title: "예식 당일 전문 촬영팀 상주",
    description:
      "360도 VR 촬영을 \n기반으로 예식 전 과정을 \n정교하게 기록합니다.",
  },
  {
    step: "03",
    title: "후반 제작 및 편집",
    description:
      "예식의 감정과 흐름을 \n고려한 프리미엄 VR 영상으로 \n완성합니다.",
  },
  {
    step: "04",
    title: "최종본 납품",
    description:
      "모바일·유튜브용으로 \n사용 가능한 포맷으로 \nVR 영상을 제공합니다.",
  },
];

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="bg-[#f7f7f7] py-[200px] flex justify-center"
    >
      <div className="w-[1400px] mx-10">
        <div className="mb-[76px]">
          <p className="text-[#ff682d] text-[26px] font-['SUIT',sans-serif] font-extrabold tracking-[-0.52px] uppercase mb-[22px]">
            Our Process
          </p>
          <h2 className="text-[40px] text-[#1f1f1f] font-['SUIT',sans-serif] font-bold mb-[30px] leading-[1.35] tracking-[-1.84px]">
            운영 방식
          </h2>
          <p className="text-[24px] text-[#1f1f1f] font-['SUIT',sans-serif] font-medium leading-[1.45]">
            Wedness는 사전 면담부터 납품까지 전 과정을 자체 운영합니다.
            <br />
            웨딩홀과 고객 모두가 안심할 수 있는 체계적인 프로세스를 제공합니다.
          </p>
        </div>

        {/* Process timeline */}
        <div className="relative">
          <div className="absolute top-[20px] w-full h-0.5 z-0 [background:linear-gradient(90deg,#FF682D_0%,rgba(247,247,247,0.00)_141.18%)]" />

          <div className="flex justify-between gap-[50px] mt-[21px] relative z-10">
            {processes.map((process, index) => (
              <div key={index} className="flex flex-col gap-[32px]">
                <div className="flex items-center gap-[10px]">
                  <div className="bg-[#ff682d] rounded-[8px] w-[41px] h-[41px] flex items-center justify-center">
                    <span className="text-[20px] text-white font-['SUIT',sans-serif] font-bold tracking-[-0.8px]">
                      {process.step}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-[20px]">
                  <h3 className="text-[26px] text-[#1f1f1f] font-['SUIT',sans-serif] font-bold leading-[1.35] tracking-[-0.78px]">
                    {process.title}
                  </h3>
                  <p className="text-[22px] text-[#1f1f1f] font-['SUIT',sans-serif] font-medium leading-[1.55] tracking-[-0.66px] whitespace-pre-line">
                    {process.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
