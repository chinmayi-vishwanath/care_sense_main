'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        // Clear demo cookie
        document.cookie = 'demo_role=; path=/; max-age=0';
        // Also sign out of Supabase (no-op if not connected)
        await supabase.auth.signOut().catch(() => {});
        router.push('/login');
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
