import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardRedirectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const role = (session.user as { role?: string }).role;

  if (role === 'INVESTOR') {
    redirect('/investor');
  } else if (role === 'ADMIN') {
    redirect('/admin');
  } else {
    redirect('/entrepreneur');
  }
}
