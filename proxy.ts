import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren sesión
const PUBLIC_PATHS = ['/login', '/register'];

// Mapa de rutas protegidas → roles permitidos
const ROLE_PATHS: Record<string, string[]> = {
  '/entrepreneur': ['ENTREPRENEUR', 'ADMIN'],
  '/investor': ['INVESTOR', 'ADMIN'],
  '/admin': ['ADMIN'],
  '/pitch-room': ['ENTREPRENEUR', 'INVESTOR', 'ADMIN'],
};

/**
 * Proxy (formerly Middleware) — Next.js 16.
 * Lee el token JWT de NextAuth desde la cookie de sesión para proteger rutas.
 * No usa auth() directamente ya que Proxy corre en el edge antes del runtime principal.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Leer la cookie de sesión de NextAuth v5 (nombre: authjs.session-token o next-auth.session-token)
  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value;

  const isAuthenticated = !!sessionToken;

  // Si es ruta pública
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    // Usuario ya logueado intentando ir a /login o /register → redirigir
    // (la redirección a la ruta correcta por rol la hace el dashboard una vez cargada la sesión)
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/entrepreneur', request.url));
    }
    return NextResponse.next();
  }

  // Si la ruta es del dashboard/app y no hay sesión → redirigir al login
  const isProtectedPath = Object.keys(ROLE_PATHS).some((p) =>
    pathname.startsWith(p)
  );

  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica proxy a todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico, robots.txt, sitemap.xml
     * - api/auth (rutas de NextAuth deben ser siempre accesibles)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/auth).*)',
  ],
};
