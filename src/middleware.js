import { NextResponse } from 'next/server';

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

export function middleware(req) {
  const token = req.cookies.get('ticketx-token')?.value;
  const path = req.nextUrl.pathname;

  let decoded = null;
  if (token) {
    decoded = decodeJwt(token);
  }

  const isAuthPage = path === '/signin' || path === '/signup';
  const isProtectedUserPage = path.startsWith('/account');

  // If user is trying to access protected user pages
  if (isProtectedUserPage) {
    if (!decoded) {
      return NextResponse.redirect(new URL(`/signin?redirect=${encodeURIComponent(path)}`, req.url));
    }
  }

  // If logged-in user tries to visit signin/signup
  if (isAuthPage && decoded) {
    if (decoded.role === 'super_admin') {
      return NextResponse.redirect(new URL('/adminpanel', req.url));
    }
    return NextResponse.redirect(new URL('/account', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/signin', '/signup']
};
