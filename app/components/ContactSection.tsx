"use client";

import { useState } from "react";
import { images } from "../images";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    weddingHall: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // 모든 필드가 입력되었는지 확인
  const isFormValid =
    formData.name.trim() !== "" &&
    formData.weddingHall.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.message.trim() !== "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "문의가 성공적으로 전송되었습니다.",
        });
        setFormData({
          name: "",
          weddingHall: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "전송 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "네트워크 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-[#1e1e1e] py-[200px] flex justify-center"
    >
      <div className="w-[1400px] mx-10">
        <div className="flex justify-between items-end mb-[82px]">
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-[22px]">
              <p className="text-[#ff682d] text-[26px] font-['SUIT',sans-serif] font-extrabold tracking-[-0.52px] uppercase">
                CONTACT US
              </p>
              <h2 className="text-[40px] text-white font-['SUIT',sans-serif] font-bold leading-[1.35] tracking-[-1.84px]">
                웨딩의 새로운 기준, WEDNESS와 함께하세요.
              </h2>
            </div>
            <p className="text-[24px] text-white font-['SUIT',sans-serif] font-medium leading-[1.45]">
              궁금하신 점이나 제휴 및 촬영 문의는 정보를 남겨주시면
              <br />
              담당자가 빠르게 확인 후 연락드리겠습니다.
            </p>
          </div>
          {/* Submit button and status */}
          <div className="flex flex-col items-end gap-[20px]">
            {submitStatus.type && (
              <p
                className={`text-[22px] font-['SUIT',sans-serif] font-medium ${
                  submitStatus.type === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {submitStatus.message}
              </p>
            )}
            <button
              type="submit"
              form="contact-form"
              disabled={!isFormValid || isSubmitting}
              className={`h-[68px] px-[46px] py-[18px] rounded-[51px] flex items-center gap-[14px] transition-all duration-300 ${
                !isFormValid || isSubmitting
                  ? "bg-[#939393] cursor-not-allowed"
                  : "bg-white"
              }`}
            >
              <img
                src={images.arrowRight2}
                alt=""
                className="w-[32px] h-[32px]"
              />
              <span
                className={`text-[26px] font-['SUIT',sans-serif] font-semibold leading-[1.4] ${
                  !isFormValid || isSubmitting
                    ? "text-[#6a6a6a]"
                    : "text-[#1e1e1e]"
                }`}
              >
                {isSubmitting ? "전송 중..." : "Submit"}
              </span>
            </button>
          </div>
        </div>

        {/* Contact form */}
        <form
          id="contact-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-[155px]"
        >
          {/* Form fields */}
          <div className="grid grid-cols-4 gap-x-[20px] gap-y-[63px]">
            <div className="flex flex-col gap-10">
              <label className="text-[26px] text-white font-['SUIT',sans-serif] font-bold leading-[1.45]">
                담당자 이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-b-2 border-white bg-transparent text-white text-[26px] outline-none"
              />
            </div>
            <div className="flex flex-col gap-10">
              <label className="text-[26px] text-white font-['SUIT',sans-serif] font-bold leading-[1.45]">
                웨딩홀명
              </label>
              <input
                type="text"
                name="weddingHall"
                value={formData.weddingHall}
                onChange={handleChange}
                required
                className="border-b-2 border-white bg-transparent text-white text-[26px] outline-none"
              />
            </div>
            <div className="flex flex-col gap-10">
              <label className="text-[26px] text-white font-['SUIT',sans-serif] font-bold leading-[1.45]">
                연락처
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border-b-2 border-white bg-transparent text-white text-[26px] outline-none"
              />
            </div>
            <div className="flex flex-col gap-10">
              <label className="text-[26px] text-white font-['SUIT',sans-serif] font-bold leading-[1.45]">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-b-2 border-white bg-transparent text-white text-[26px] outline-none"
              />
            </div>
            <div className="flex flex-col gap-10 col-span-3">
              <label className="text-[26px] text-white font-['SUIT',sans-serif] font-bold leading-[1.45]">
                문의 내용
              </label>
              <input
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="border-b-2 border-white bg-transparent text-white text-[26px] outline-none resize-none"
              />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
