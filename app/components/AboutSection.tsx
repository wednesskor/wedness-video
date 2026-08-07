"use client";

import { useRef } from "react";
import { images } from "../images";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";

export default function AboutSection() {
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <section
      id="about"
      className="bg-white py-[210px] flex justify-center overflow-hidden"
    >
      <div className="w-[1400px] ml-10">
        <div className="relative">
          {/* Left content */}
          <div className="flex flex-col gap-[65px]">
            <div className="flex flex-col">
              <div>
                <p className="text-[#ff682d] text-[26px] font-suit font-extrabold tracking-[-0.52px] uppercase mb-[22px] whitespace-nowrap">
                  About Us
                </p>
                <h2 className="text-[40px] text-black font-suit font-bold leading-[1.35] tracking-[-1.84px] whitespace-nowrap mb-[30px]">
                  국내 최초 프리미엄 <br />
                  VR 웨딩 촬영 서비스
                </h2>
              </div>
              <p className="text-[24px] text-black font-suit font-medium leading-[1.45] whitespace-nowrap">
                Wedness는 웨딩 예식을
                <br />
                <span className="font-extrabold">360도 VR로 정교하게 기록</span>
                하여,
                <br />
                시간이 지나도 변함없이 그날의 감동을
                <br />
                다시 경험할 수 있도록 합니다.
              </p>
            </div>
            {/* Navigation dots */}
            <div className="flex gap-[62px] ml-[3px]">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="group w-[50px] h-[50px] rounded-full bg-white/50 flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-gradient-to-b hover:from-[#f54b08] hover:to-[#ffa32b] relative"
              >
                <img
                  src={images.arrowRight}
                  alt=""
                  className="rotate-180 w-[32px] h-[32px] transition-opacity duration-300 group-hover:opacity-0 absolute"
                />
                <img
                  src={images.arrowRight1}
                  alt=""
                  className="rotate-180 w-[32px] h-[32px] transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="group w-[50px] h-[50px] rounded-full bg-white/50 flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-gradient-to-b hover:from-[#f54b08] hover:to-[#ffa32b] relative"
              >
                <img
                  src={images.arrowRight}
                  alt=""
                  className="w-[32px] h-[32px] transition-opacity duration-300 group-hover:opacity-0 absolute"
                />
                <img
                  src={images.arrowRight1}
                  alt=""
                  className="w-[32px] h-[32px] transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                />
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="w-[1130px] absolute bottom-0 left-[500px]">
            <Swiper
              slidesPerView={3.2}
              slidesPerGroup={1}
              spaceBetween={20}
              // loop
              modules={[Pagination]}
              className="mySwiper"
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              <SwiperSlide>
                <div className="group h-full rounded-[16px] border border-[#d5d5d5] p-[37px] bg-white transition-all duration-300 hover:border-transparent hover:[background-image:linear-gradient(150.558deg,rgb(245,75,8)_3.092%,rgb(255,163,43)_100.42%)]">
                  <img
                    src={images.camera}
                    alt=""
                    className="w-[45px] h-[45px] mb-[186px] transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                  />
                  <h3 className="text-[26px] text-black group-hover:text-white font-['SUIT',sans-serif] font-bold leading-[1.35] tracking-[-0.78px] mb-[20px] transition-colors duration-300">
                    One-Stop 제작
                  </h3>
                  <p className="text-[22px] text-black group-hover:text-white font-['SUIT',sans-serif] font-medium leading-[1.55] tracking-[-0.66px] transition-colors duration-300">
                    촬영부터 편집, 최종 납품까지 전 과정을 자체 운영합니다.
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="group h-full rounded-[16px] border border-[#d5d5d5] p-[37px] bg-white transition-all duration-300 hover:border-transparent hover:[background-image:linear-gradient(150.558deg,rgb(245,75,8)_3.092%,rgb(255,163,43)_100.42%)]">
                  <img
                    src={images.wedding}
                    alt=""
                    className="w-[45px] h-[45px] mb-[186px] transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                  />
                  <h3 className="text-[26px] text-black group-hover:text-white font-['SUIT',sans-serif] font-bold leading-[1.35] tracking-[-0.78px] mb-[20px] transition-colors duration-300">
                    웨딩홀 맞춤 시나리오
                  </h3>
                  <p className="text-[22px]  text-black group-hover:text-white font-['SUIT',sans-serif] font-medium leading-[1.55] tracking-[-0.66px] transition-colors duration-300">
                    웨딩홀 환경에 특화된 VR 촬영 시나리오를 설계합니다.
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="group h-full rounded-[16px] border border-[#d5d5d5] p-[37px] bg-white transition-all duration-300 hover:border-transparent hover:[background-image:linear-gradient(150.558deg,rgb(245,75,8)_3.092%,rgb(255,163,43)_100.42%)]">
                  <img
                    src={images.peopleTeam}
                    alt=""
                    className="w-[45px] h-[45px] mb-[186px] transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                  />
                  <h3 className="text-[26px] text-black group-hover:text-white font-['SUIT',sans-serif] font-bold leading-[1.35] tracking-[-0.78px] mb-[20px] transition-colors duration-300">
                    전문 촬영팀 상주
                  </h3>
                  <p className="text-[22px] text-black group-hover:text-white font-['SUIT',sans-serif] font-medium leading-[1.55] tracking-[-0.66px] transition-colors duration-300">
                    예식 당일 VR 전문 촬영팀이 현장에 상주합니다.
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="group h-full rounded-[16px] border border-[#d5d5d5] p-[37px] bg-white transition-all duration-300 hover:border-transparent hover:[background-image:linear-gradient(150.558deg,rgb(245,75,8)_3.092%,rgb(255,163,43)_100.42%)]">
                  <img
                    src={images.linkMultiple}
                    alt=""
                    className="w-[45px] h-[45px] mb-[186px] transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                  />
                  <h3 className="text-[26px] text-black group-hover:text-white font-['SUIT',sans-serif] font-bold leading-[1.35] tracking-[-0.78px] mb-[20px] transition-colors duration-300">
                    멀티 플랫폼 제공
                  </h3>
                  <p className="text-[22px] text-black group-hover:text-white font-['SUIT',sans-serif] font-medium leading-[1.55] tracking-[-0.66px] transition-colors duration-300">
                    VR · 모바일 · 유튜브용 영상을 동시에 제공합니다.
                  </p>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
