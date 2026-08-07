import { images } from "../images";

export default function WhySection() {
  return (
    <section id="why" className="relative w-full h-[1200px]">
      {/* Background gradient */}
      <div className="absolute w-full h-full [background:linear-gradient(116deg,#000_-62.27%,#3D1100_84.12%)]"></div>

      {/* Background image */}
      <div className="absolute right-0 bottom-0 blur-[1.35px] mix-blend-screen">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(0, 0, 0, 0) 63.208%, rgba(0, 0, 0, 0.62) 100%), linear-gradient(rgba(0, 0, 0, 0) 68.291%, rgba(0, 0, 0, 0.72) 100%), linear-gradient(-76.7028deg, rgba(0, 0, 0, 0) 40.168%, rgb(0, 0, 0) 78.519%)",
          }}
        />
        <img src={images.whyPeople} alt="" />
      </div>

      {/* Content */}
      <div className="flex justify-center">
        <div className="relative z-10 py-[200px] w-[1400px] mx-10">
          {/* Left content */}
          <div className="flex flex-col w-[534px]">
            <p className="text-[#ff682d] text-[26px] font-['SUIT',sans-serif] font-extrabold tracking-[-0.52px] uppercase mb-[22px]">
              WHY?
            </p>
            <h2 className="mb-[30px] text-[40px] text-white font-['SUIT',sans-serif] font-bold leading-[1.35] tracking-[-1.84px]">
              왜 VR 웨딩인가요?
            </h2>
            <div className="text-[24px] text-white font-['SUIT',sans-serif] font-medium leading-[1.45]">
              <p className="mb-0">
                VR 웨딩은 이미 글로벌 웨딩 트렌드이지만 국내에는{" "}
                <span className="font-extrabold">
                  전문적으로 제공하는 기업이 없습니다.
                </span>
              </p>
              <br />
              <p className="mb-0">
                Wedness는 웨딩의 본질인 순간의 감동과 분위기를{" "}
                <span className="font-extrabold">
                  가장 생생하게 기록하는 새로운 기준을 제시
                </span>
                합니다.
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="relative">
            <img
              src={images.vector1}
              alt=""
              className="w-[1040px] h-[362px] absolute left-[134px] -top-[195px]"
            />

            {/* Data points */}
            <div className="absolute left-[8px] top-[124px]">
              <div className="flex flex-col items-end">
                <img
                  src={images.place}
                  alt=""
                  className="w-[45px] h-[45px] mb-[30px]"
                />
                <p className="text-[20px] text-white font-['SUIT',sans-serif] font-normal opacity-80 uppercase">
                  2020년도
                </p>
                <p className="text-[88px] text-white font-['SUIT',sans-serif] font-bold opacity-80 -mt-[20px] -mr-[10px]">
                  16.5
                </p>
                <p className="text-[40px] text-white font-['SUIT',sans-serif] font-semibold opacity-80 -mt-[20px]">
                  억 달러
                </p>
              </div>
            </div>

            <div className="absolute left-[589px] top-[23px]">
              <div className="flex flex-col items-end">
                <img
                  src={images.place}
                  alt=""
                  className="w-[45px] h-[45px] mb-[30px]"
                />
                <p className="text-[20px] text-white font-['SUIT',sans-serif] font-normal opacity-80 uppercase">
                  2024년도
                </p>
                <p className="text-[88px] text-white font-['SUIT',sans-serif] font-bold opacity-80 -mt-[20px] -mr-[10px]">
                  40.4
                </p>
                <p className="text-[40px] text-white font-['SUIT',sans-serif] font-semibold opacity-80 -mt-[20px]">
                  억 달러
                </p>
              </div>
            </div>

            <div className="absolute left-[1120px] top-[-236px]">
              <img
                src={images.place1}
                alt=""
                className="w-[45px] h-[45px] mb-[20px] ml-[30px]"
              />
              <div className="flex flex-col items-end">
                <p className="text-[20px] text-[#ffb725] font-['SUIT',sans-serif] font-normal uppercase mt-[20px]">
                  2029년 예상
                </p>
                <p
                  className="text-[110px] font-['SUIT',sans-serif] font-extrabold bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(261.577deg, rgb(255, 114, 39) 5.8403%, rgb(255, 199, 29) 111.58%)",
                  }}
                >
                  62.0
                </p>
                <p
                  className="text-[40px] font-['SUIT',sans-serif] font-semibold bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(258.863deg, rgb(255, 114, 39) 5.8403%, rgb(255, 199, 29) 111.58%)",
                  }}
                >
                  억 달러
                </p>
              </div>
            </div>
          </div>

          {/* Caption */}
          <p className="text-[22px] text-white font-medium opacity-50 text-right absolute bottom-[-180px] right-[260px]">
            전 세계 디지털 <br />
            VR/AR/MR 시장 규모
          </p>
        </div>
      </div>
    </section>
  );
}
