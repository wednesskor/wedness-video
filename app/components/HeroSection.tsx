import { images } from "../images";

export default function HeroSection() {
  return (
    <div className="relative w-full h-[954px]">
      {/* Background gradient */}
      <div className="absolute inset-0 [background:linear-gradient(112deg,#000_-23.97%,#3D1100_83.07%)]"></div>

      {/* Background images */}
      <div className="absolute top-0 right-0 w-[1489px] h-full">
        <div className="absolute h-full mix-blend-screen opacity-[0.36] left-0 top-0 w-full bg-cover bg-center">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${images.hero1})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(0, 0, 0, 0) 63.208%, rgba(0, 0, 0, 0.62) 100%), linear-gradient(rgba(0, 0, 0, 0) 68.291%, rgba(0, 0, 0, 0.72) 100%), linear-gradient(-76.7028deg, rgba(0, 0, 0, 0) 40.168%, rgb(0, 0, 0) 78.519%)",
            }}
          />
        </div>
        <div
          className="absolute h-full mix-blend-screen left-0 top-0 w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${images.hero2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="flex justify-center">
        <div className="relative z-10 w-[1400px] mx-10 mt-[213px]">
          <div className="mb-[105px] relative w-fit">
            <h1 className="text-[40px] text-white font-audiowide leading-[1.35]">
              WEDNESS
            </h1>
            <img
              src={images.vector}
              alt=""
              className="w-[40.833px] h-[40.833px] absolute -top-3 -right-12"
            />
          </div>
          <div className="mb-[274px]">
            <h2 className="text-[60px] text-white font-['SUIT',sans-serif] font-bold leading-[1.3] mb-[36px]">
              국내 최초 <br />
              프리미엄 VR 웨딩 촬영
            </h2>
            <p className="text-[28px] text-white font-['SUIT',sans-serif] font-medium leading-[1.35] w-[749px]">
              당신의 결혼식, 그 날의 분위기를 언제든 다시 느껴보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
