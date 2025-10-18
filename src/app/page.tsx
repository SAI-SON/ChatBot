'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, Code, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-purple">
           <div className="absolute inset-0 bg-background/30 dark:bg-background/70 backdrop-blur-sm"></div>
          <div className="container relative z-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Your Smart AI Chat Assistant
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-foreground sm:text-xl md:text-2xl">
              Chat effortlessly, get instant answers, and experience the power of AI. Our assistant is here to help you 24/7.
            </p>
            <div className="mt-10">
              <Button asChild size="lg">
                <Link href="/chatbot">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                Features
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover what our AI assistant can do for you.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="items-center">
                   <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                     <Bot className="h-8 w-8 text-primary" />
                   </div>
                  <CardTitle className="mt-4">Smart Conversations</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Engage in natural, human-like conversations. Our AI understands context and provides relevant answers.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                    <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                        <Zap className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle className="mt-4">Instant Answers</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Get immediate responses to your questions. No more waiting for support agents.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                    <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                        <Code className="h-8 w-8 text-primary" />
                    </div>
                  <CardTitle className="mt-4">Developer Friendly</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Easily integrate our AI assistant into your existing applications and workflows with our simple API.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-secondary/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A simple three-step process to get you started.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                <p>Create an account in seconds to get started.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Ask a Question</h3>
                <p>Type your question into the chat window.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Get an Answer</h3>
                <p>Our AI provides an instant, accurate response.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
