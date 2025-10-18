
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Mic, Bot, User, Loader, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chatbot, type ChatbotOutput } from '@/ai/flows/chatbot-flow';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { SettingsSheet } from '@/components/settings-sheet';
import type { ChatSettings } from '@/components/settings-sheet';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  audio?: string;
}

// SpeechRecognition type might not be available in all environments
// We'll declare it to avoid TypeScript errors
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const recognitionRef = useRef<any>(null);

  // Settings state
  const [settings, setSettings] = useState<ChatSettings>({
    enableAudio: true,
    language: 'en',
    personality: 'friendly',
    responseStyle: 'normal',
    theme: 'system',
  });

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = settings.language;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        toast({
          variant: "destructive",
          title: "Microphone Error",
          description: event.error === 'not-allowed' ? "Permission to use microphone was denied." : "An error occurred with the microphone.",
        });
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    } else {
        console.warn("Speech Recognition not supported in this browser.");
    }
  }, [settings.language, toast]);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollableNode = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableNode) {
        scrollableNode.scrollTo({
            top: scrollableNode.scrollHeight,
            behavior: 'smooth',
        });
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const playAudio = (audioDataUri: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioDataUri;
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { id: uuidv4(), text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result: ChatbotOutput = await chatbot({
        userMessage: messageText,
        enableAudio: settings.enableAudio,
        language: settings.language,
        personality: settings.personality,
        responseStyle: settings.responseStyle,
      });
      
      const aiMessage: Message = { id: uuidv4(), text: result.reply, sender: 'ai', audio: result.audio };
      setMessages(prev => [...prev, aiMessage]);

      if (result.audio && settings.enableAudio) {
        playAudio(result.audio);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem communicating with the AI.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
       toast({
          variant: "destructive",
          title: "Unsupported Browser",
          description: "Your browser does not support speech recognition.",
        });
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="h-[calc(100vh-theme(height.14))] flex items-center justify-center bg-muted/30 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-4xl h-full flex flex-col shadow-2xl">
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="p-4 border-b flex items-center justify-between">
            <div className='flex items-center gap-3'>
              <Bot className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-headline">AI Assistant</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettings(s => ({ ...s, enableAudio: !s.enableAudio }))}
                suppressHydrationWarning
              >
                {settings.enableAudio ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
                <span className="sr-only">Toggle Audio</span>
              </Button>
              <SettingsSheet settings={settings} onSettingsChange={setSettings} />
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start gap-3',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'ai' && (
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback><Bot size={20}/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-md rounded-xl px-4 py-3 text-sm shadow-sm',
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-secondary text-secondary-foreground rounded-bl-none'
                    )}
                  >
                    <p>{message.text}</p>
                  </div>
                   {message.sender === 'user' && (
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback><User size={20}/></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className='flex items-start gap-3 justify-start'>
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback><Bot size={20}/></AvatarFallback>
                    </Avatar>
                    <div className='max-w-md rounded-xl px-4 py-3 text-sm shadow-sm bg-secondary text-secondary-foreground rounded-bl-none'>
                        <div className="flex items-center gap-2">
                           <Loader className="animate-spin w-4 h-4" />
                           <span>Thinking...</span>
                        </div>
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="relative">
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
                disabled={isLoading}
                className="pr-24 h-12 text-base"
                suppressHydrationWarning
              />
              <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2">
                 <Button 
                    variant="secondary" 
                    size="icon" 
                    disabled={isLoading} 
                    onClick={toggleRecording}
                    className={cn(isRecording && 'bg-red-500/20 text-red-500 hover:bg-red-500/30')}
                    suppressHydrationWarning
                  >
                    <Mic className="h-5 w-5" />
                    <span className="sr-only">Use Microphone</span>
                 </Button>
                <Button 
                    onClick={() => handleSendMessage(input)} 
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    suppressHydrationWarning
                >
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <audio ref={audioRef} className="hidden" />
      </Card>
    </div>
  );
}
