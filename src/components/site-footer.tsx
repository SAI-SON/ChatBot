import { Bot, Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function SiteFooter() {
    return (
        <footer id="contact" className="w-full border-t bg-background">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <Bot className="h-6 w-6 text-primary" />
                    <p className="text-center text-sm leading-loose md:text-left">
                        © {new Date().getFullYear()} AI Assistant. Powered by AI.
                    </p>
                </div>
                 <div className="flex items-center gap-4">
                    <Link href="#" target="_blank" rel="noreferrer">
                        <div className="rounded-lg p-2 transition-colors hover:bg-muted">
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </div>
                    </Link>
                     <Link href="#" target="_blank" rel="noreferrer">
                        <div className="rounded-lg p-2 transition-colors hover:bg-muted">
                            <Twitter className="h-5 w-5" />
                             <span className="sr-only">Twitter</span>
                        </div>
                    </Link>
                     <Link href="#" target="_blank" rel="noreferrer">
                        <div className="rounded-lg p-2 transition-colors hover:bg-muted">
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                        </div>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
