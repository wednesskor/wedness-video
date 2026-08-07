import { NextRequest, NextResponse } from "next/server";
// @ts-ignore - nodemailer types
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, weddingHall, phone, email, message } = body;

    // 필수 필드 검증
    if (!name || !weddingHall || !phone || !email || !message) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 주소를 입력해주세요." },
        { status: 400 }
      );
    }

    // nodemailer transporter 설정
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 이메일 내용
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER,
      subject: `[WEDNESS 문의] ${weddingHall} - ${name}`,
      html: `
        <h2>새로운 문의가 접수되었습니다</h2>
        <hr />
        <p><strong>담당자 이름:</strong> ${name}</p>
        <p><strong>웨딩홀명:</strong> ${weddingHall}</p>
        <p><strong>연락처:</strong> ${phone}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <hr />
        <h3>문의 내용:</h3>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
      text: `
        새로운 문의가 접수되었습니다

        담당자 이름: ${name}
        웨딩홀명: ${weddingHall}
        연락처: ${phone}
        이메일: ${email}

        문의 내용:
        ${message}
      `,
    };

    // 이메일 전송
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "문의가 성공적으로 전송되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error("이메일 전송 오류:", error);
    return NextResponse.json(
      { error: "이메일 전송 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
