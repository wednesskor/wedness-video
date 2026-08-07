"use client";

import { useEffect, useState } from "react";

const menuItems = [
  { id: "about", label: "ABOUT US" },
  { id: "why", label: "WHY?" },
  { id: "benefits", label: "BENEFITS" },
  { id: "process", label: "OUR PROCESS" },
  { id: "contact", label: "CONTACT US" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState<string>("about");
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // 모든 섹션 관찰 시작
    menuItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);

      // 스크롤이 멈추면 일정 시간 후 숨기기
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1000); // 1초 후 숨김
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100; // 상단 여백
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`fixed right-[60px] top-1/2 -translate-y-1/2 z-50 transition-opacity duration-300 ${
        isScrolling ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col gap-[15px]">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <div
              key={item.id}
              className="flex items-center gap-[14px] cursor-pointer group"
              onClick={() => handleClick(item.id)}
            >
              <span
                className={`text-[18px] font-['SUIT',sans-serif] font-bold uppercase tracking-[-0.36px] transition-colors duration-300 w-[150px] text-right whitespace-nowrap ${
                  isActive ? "text-[#ff682d]" : "text-[#d6d6d6]"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-[8px] h-[8px] bg-[#ff682d] rounded-full flex-shrink-0"></div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
