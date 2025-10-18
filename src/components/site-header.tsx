'use client';

import Link from 'next/link';
import { Bot, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';


export function SiteHeader() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex flex-1 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              AI Assistant
            </span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
             {navLinks.map(link => (
                 <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        'transition-colors hover:text-foreground/80',
                        isMounted && (pathname === link.href || pathname.startsWith(link.href + '/')) ? 'text-foreground' : 'text-foreground/60'
                    )}
                    >
                    {link.label}
                </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center justify-end space-x-2">
           {!isMounted ? (
            <>
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-10 w-10" />
            </>
           ) : (
            <>
                <Button asChild>
                    <Link href="/chatbot">Get Started</Link>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Theme</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setTheme('light')}>
                        Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')}>
                        Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')}>
                        System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </>
           )}
        </div>
      </div>
    </header>
  );
}
