"use client";
import type { ReactNode } from 'react';
import { SidebarNav } from '@/components/layout/SidebarNav';
import { UserNav } from '@/components/layout/UserNav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    // Skeleton loader for the dashboard layout
    return (
      <div className="flex min-h-screen">
        {/* Sidebar Skeleton */}
        <div className="hidden md:block w-64 bg-muted p-4 space-y-4 border-r">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-5/6" />
          <Skeleton className="h-8 w-full mt-auto" />
        </div>
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          {/* Header Skeleton */}
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <Skeleton className="h-8 w-8 md:hidden" /> {/* Mobile Menu Trigger Skeleton */}
            <div className="flex-1" /> {/* Spacer */}
            <Skeleton className="h-10 w-10 rounded-full" /> {/* UserNav Skeleton */}
          </header>
          {/* Page Content Skeleton */}
          <main className="flex-1 p-6">
            <Skeleton className="h-12 w-1/2 mb-6" />
            <Skeleton className="h-64 w-full" />
          </main>
        </div>
      </div>
    );
  }


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar md:block">
        <SidebarNav />
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-[280px] bg-sidebar">
              <SidebarNav />
            </SheetContent>
          </Sheet>
          <div className="flex-1" /> {/* This will push UserNav to the right */}
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
