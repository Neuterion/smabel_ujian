import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function middleware(req) {
  console.log(rq.nextUrl.pathname)
  if (req.nextUrl.pathname === "/teacher/test") {
    const session = await getSession({ req });
    if (!session) return NextResponse.redirect("/api/auth/signin");
  }
  return NextResponse.next();
}