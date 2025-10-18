
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Code,
  Feather,
  Laptop,
  Moon,
  Paintbrush,
  RotateCcw,
  Settings,
  Sparkles,
  Sun,
  User,
  Wrench,
  Zap,
  Bot,
  Mic,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

export interface ChatSettings {
  enableAudio: boolean;
  language: string;
  personality: string;
  responseStyle: string;
  theme: string;
}

interface SettingsSheetProps {
  settings: ChatSettings;
  onSettingsChange: (settings: ChatSettings) => void;
}

const personalityOptions = [
    { value: 'teacher', label: 'Teacher Mode', description: 'Explains slowly, step-by-step.', icon: BookOpen },
    { value: 'friendly', label: 'Friendly Mode', description: 'Casual and fun.', icon: Sparkles },
    { value: 'coder', label: 'Coder Mode', description: 'Focused and technical.', icon: Code },
    { value: 'creative', label: 'Creative Mode', description: 'Imaginative and expressive.', icon: Feather },
    { value: 'calm', label: 'Calm', description: 'Short, peaceful, and simple replies.', icon: Bot },
];

const responseStyleOptions = [
    { value: 'simple', label: 'Simple', description: '1-2 line response.' },
    { value: 'normal', label: 'Normal', description: '3-5 line response.' },
    { value: 'detailed', label: 'Detailed', description: 'Explains everything clearly.' },
];

export function SettingsSheet({ settings, onSettingsChange }: SettingsSheetProps) {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleSettingChange = (key: keyof ChatSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    onSettingsChange(newSettings);
    if (key === 'theme') {
      setTheme(value);
    }
  };
  
  const handleReset = () => {
    onSettingsChange({
        enableAudio: true,
        language: 'en',
        personality: 'friendly',
        responseStyle: 'normal',
        theme: 'system',
    });
    setTheme('system');
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" suppressHydrationWarning>
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5"/>
            Chatbot Settings
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-6">
            <div className="py-4">
            <Tabs defaultValue="personality" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personality"><User className="w-4 h-4 mr-2"/>Personality</TabsTrigger>
                <TabsTrigger value="appearance"><Paintbrush className="w-4 h-4 mr-2"/>Appearance</TabsTrigger>
                <TabsTrigger value="general"><Wrench className="w-4 h-4 mr-2"/>General</TabsTrigger>
                <TabsTrigger value="advanced"><Zap className="w-4 h-4 mr-2"/>Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="personality" className="pt-6">
                <div className="space-y-8">
                    <div>
                        <h3 className="text-lg font-medium">Personality / Tone</h3>
                        <p className="text-sm text-muted-foreground">Make the chatbot feel unique.</p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {personalityOptions.map(option => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSettingChange('personality', option.value)}
                                    className={cn(
                                        "rounded-lg border p-4 cursor-pointer transition-all",
                                        settings.personality === option.value && "border-primary ring-2 ring-primary",
                                        "hover:bg-accent/50 hover:border-primary/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3 mb-1">
                                        <option.icon className="w-5 h-5 text-primary"/>
                                        <h4 className="font-semibold">{option.label}</h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{option.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium">Response Style</h3>
                        <p className="text-sm text-muted-foreground">Control how detailed replies should be.</p>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {responseStyleOptions.map(option => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSettingChange('responseStyle', option.value)}
                                    className={cn(
                                        "rounded-lg border p-4 text-center cursor-pointer transition-all hover:bg-accent/50 hover:border-primary/50",
                                        settings.responseStyle === option.value && "border-primary ring-2 ring-primary",
                                    )}
                                >
                                    <h4 className="font-semibold">{option.label}</h4>
                                    <p className="text-xs text-muted-foreground">{option.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </TabsContent>
                <TabsContent value="appearance" className="pt-6">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium">Theme</h3>
                            <p className="text-sm text-muted-foreground mb-4">Choose the appearance of the interface.</p>
                            <RadioGroup value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)} className="grid grid-cols-3 gap-4">
                                <Label className="rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary text-center flex flex-col items-center justify-center space-y-2 cursor-pointer h-24">
                                    <RadioGroupItem value="light" className="sr-only"/>
                                    <Sun className="w-8 h-8"/>
                                    <span>Light</span>
                                </Label>
                                <Label className="rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary text-center flex flex-col items-center justify-center space-y-2 cursor-pointer h-24">
                                    <RadioGroupItem value="dark" className="sr-only"/>
                                    <Moon className="w-8 h-8"/>
                                    <span>Dark</span>
                                </Label>
                                <Label className="rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary text-center flex flex-col items-center justify-center space-y-2 cursor-pointer h-24">
                                    <RadioGroupItem value="system" className="sr-only"/>
                                    <Laptop className="w-8 h-8"/>
                                    <span>System</span>
                                </Label>
                            </RadioGroup>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="general" className="pt-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Mic className="w-5 h-5" />
                                <div>
                                    <Label htmlFor="audio-switch" className="text-base font-medium">Enable Audio Output</Label>
                                    <p className="text-xs text-muted-foreground">Receive spoken responses from the AI.</p>
                                </div>
                            </div>
                            <Switch
                                id="audio-switch"
                                checked={settings.enableAudio}
                                onCheckedChange={(checked) => handleSettingChange('enableAudio', checked)}
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Language</h3>
                            <p className="text-sm text-muted-foreground mb-4">Choose the language for the conversation.</p>
                            <RadioGroup value={settings.language} onValueChange={(value) => handleSettingChange('language', value)} className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="en" id="lang-en" />
                                    <Label htmlFor="lang-en">English</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="es" id="lang-es" />
                                    <Label htmlFor="lang-es">Spanish</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="fr" id="lang-fr" />
                                    <Label htmlFor="lang-fr">French</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="de" id="lang-de" />
                                    <Label htmlFor="lang-de">German</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="hi" id="lang-hi" />
                                    <Label htmlFor="lang-hi">Hindi</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="ta" id="lang-ta" />
                                    <Label htmlFor="lang-ta">Tamil</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="advanced" className="pt-6">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div>
                                <Label className="text-base font-medium">Enable Code Execution Sandbox</Label>
                                <p className="text-xs text-muted-foreground">Allow the AI to execute code in a sandboxed environment (coming soon).</p>
                            </div>
                            <Switch />
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div>
                                <Label className="text-base font-medium">Enable Live API Fetching</Label>
                                <p className="text-xs text-muted-foreground">Allow the AI to fetch live data from APIs (coming soon).</p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            </div>
        </ScrollArea>
        <DialogFooter>
            <Button variant="ghost" onClick={handleReset}><RotateCcw className="w-4 h-4 mr-2"/> Reset</Button>
            <Button onClick={() => setIsOpen(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
