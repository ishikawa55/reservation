// src/middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isIndexPage = req.nextUrl.pathname === "/";
    const isDoctorPage = req.nextUrl.pathname.startsWith("/doctor");
    const isPatientPage = req.nextUrl.pathname.startsWith("/patient");

    // 1. ログインしていない場合は、NextAuthが自動でログイン画面に飛ばします

    // 2. 院長専用ページに患者がアクセスしようとした場合
    if (isDoctorPage && token?.role !== "DOCTOR") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 3. 患者専用ページに院長がアクセスしようとした場合
    if (isPatientPage && token?.role !== "PATIENT") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // トークンが存在する場合のみミドルウェアを実行する
      authorized: ({ token }) => !!token,
    },
  }
);

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: [
    "/",
    "/doctor/:path*",
    "/patient/:path*",
  ],
};
