"use client";

import { useState } from "react";
import { images } from "../images";

const customerBenefits = [
  {
    icon: images.benefit1,
    title: "평생 되살아나는 결혼식의 감동",
    description:
      "사진·영상으로는 담을 수 없던 공기, 분위기, 사람들의 반응까지 그대로 기록됩니다.",
  },
  {
    icon: images.benefit2,
    title: "참석하지 못한 지인을 위한 최고의 경험",
    description:
      "해외에 있거나 참석이 어려운 가족·친지도 예식 현장에 있는 듯한 감동을 경험합니다.",
  },
  {
    icon: images.benefit3,
    title: "미래의 자녀에게 남기는 최고의 선물",
    description:
      "부모님의 결혼식을 VR로 직접 '체험'하는 특별한 추억을 남깁니다.",
  },
  {
    icon: images.benefit4,
    title: "손쉬운 공유, 확장되는 추억",
    description:
      "유튜브 업로드가 가능한 영상 포맷으로 제공되어 언제든 쉽게 공유할 수 있습니다.",
  },
];

const weddingHallBenefits = [
  {
    icon: images.benefit5,
    title: "브랜드 가치를 높이는 프리미엄 서비스",
    description:
      "VR 웨딩 촬영 기본 제공만으로도 웨딩홀의 경쟁력과 차별화된 이미지를 완성합니다.",
  },
  {
    icon: images.benefit6,
    title: "자연스럽게 확산되는 바이럴 효과",
    description:
      "고객이 영상을 SNS·유튜브에 공유할 때 웨딩홀의 이름과 공간이 자연스러운 홍보 자산으로 남습니다.",
  },
  {
    icon: images.benefit7,
    title: "강력한 고객 유치 콘텐츠",
    description:
      "몰입형 VR 웨딩 경험은 예비부부의 감성과 호기심을 자극해 웨딩홀 선택의 중요한 기준이 됩니다.",
  },
  {
    icon: images.benefit8,
    title: "운영 부담 없이 제공 가능한 서비스",
    description:
      "촬영, 인력 관리, 후반 편집, 최종 납품까지 모든 과정은 Wedness가 책임지고 운영합니다",
  },
];

export default function BenefitsSection() {
  const [activeTab, setActiveTab] = useState<"customer" | "weddingHall">(
    "customer"
  );

  const handleTabChange = (tab: "customer" | "weddingHall") => {
    setActiveTab(tab);
  };

  // activeTab에 따라 다른 benefits 배열 사용
  const currentBenefits =
    activeTab === "customer" ? customerBenefits : weddingHallBenefits;

  return (
    <section
      id="benefits"
      className="bg-white py-[200px] w-full flex justify-center"
    >
      <div className="w-[1400px] mx-10">
        <div className="flex gap-[78px]">
          {/* Left sidebar */}
          <div>
            <div className="mb-[85px]">
              <p className="text-[#ff682d] text-[26px] font-['SUIT',sans-serif] font-extrabold tracking-[-0.52px] uppercase mb-[22px]">
                BENEFITS
              </p>
              <h2 className="text-[40px] text-black font-['SUIT',sans-serif] font-bold leading-[1.35] tracking-[-1.84px] whitespace-nowrap">
                WEDNESS만의 <br />
                차별화된 혜택
              </h2>
            </div>

            {/* Navigation */}
            <div className="flex gap-[58px]">
              <div className="relative">
                <div className="w-[1px] h-36 bg-[#d6d6d6]"></div>
                <div className="w-[29px] h-[29px] absolute top-[11px] left-1/2 -translate-x-1/2">
                  {activeTab === "customer" ? (
                    <>
                      <div className="w-[29px] h-[29px] border-[1px] border-[#FF682D] bg-white rounded-full flex justify-center items-center">
                        <div className="w-[11px] h-[11px] bg-[#FF682D] rounded-full"></div>
                      </div>
                      <div className="w-[30px] h-[1px] bg-[#d6d6d6] absolute right-[-30px] top-1/2 -translate-y-1/2"></div>
                    </>
                  ) : (
                    <div className="w-[29px] h-[29px] flex justify-center items-center">
                      <div className="w-[11px] h-[11px] bg-[#d6d6d6] rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="w-[29px] h-[29px] absolute top-[75px] left-1/2 -translate-x-1/2">
                  {activeTab === "weddingHall" ? (
                    <>
                      <div className="w-[29px] h-[29px] border-[1px] border-[#FF682D] bg-white rounded-full flex justify-center items-center">
                        <div className="w-[11px] h-[11px] bg-[#FF682D] rounded-full"></div>
                      </div>
                      <div className="w-[30px] h-[1px] bg-[#d6d6d6] absolute right-[-30px] top-1/2 -translate-y-1/2"></div>
                    </>
                  ) : (
                    <div className="w-[29px] h-[29px] flex justify-center items-center">
                      <div className="w-[11px] h-[11px] bg-[#d6d6d6] rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-[27px] mt-[6px]">
                <p
                  className={`text-[26px] font-['SUIT',sans-serif] font-semibold cursor-pointer transition-colors duration-300 ${
                    activeTab === "customer"
                      ? "text-[#ff682d]"
                      : "text-[#d6d6d6]"
                  }`}
                  onClick={() => handleTabChange("customer")}
                >
                  고객혜택
                </p>
                <p
                  className={`text-[26px] font-['SUIT',sans-serif] font-semibold cursor-pointer transition-colors duration-300 ${
                    activeTab === "weddingHall"
                      ? "text-[#ff682d]"
                      : "text-[#d6d6d6]"
                  }`}
                  onClick={() => handleTabChange("weddingHall")}
                >
                  웨딩홀 혜택
                </p>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="flex flex-col mt-[265px]">
            <div className="flex flex-col gap-[22px] mb-[46px]">
              <h3 className="text-[34px] text-black font-['SUIT',sans-serif] font-bold leading-[1.35] tracking-[-1.36px]">
                {activeTab === "customer" ? "고객 혜택" : "웨딩홀 혜택"}
              </h3>
              <p className="text-[26px] text-black font-['SUIT',sans-serif] font-medium leading-[1.45] whitespace-pre-line">
                {activeTab === "customer"
                  ? "고객을 위한 혜택, 오직 Wedness에서만 가능합니다. \n단 한 번의 예식을 평생 체험할 수 있는 특별한 기록으로 남겨드립니다."
                  : "웨딩홀을 위한 혜택, 오직 Wedness와의 제휴로만 가능합니다. \n프리미엄 VR 웨딩 서비스로 브랜드 가치부터 매출 성과까지 함께 높입니다."}
              </p>
            </div>

            {/* Benefits list */}
            <div className="flex flex-col gap-[16px]">
              {currentBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-[#f7f7f7] rounded-[16px] h-[131px] flex items-center gap-[30px] px-[34px]"
                >
                  <img
                    src={benefit.icon}
                    alt=""
                    className="w-[71px] h-[71px] flex-shrink-0"
                  />
                  <div className="flex flex-col justify-center">
                    <h4 className="text-[26px] text-[#232323] font-['SUIT',sans-serif] font-bold leading-[1.35] tracking-[-0.78px] mb-[20px]">
                      {benefit.title}
                    </h4>
                    <p className="text-[22px] text-[#232323] font-['SUIT',sans-serif] font-medium leading-[1.55] tracking-[-0.66px]">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
