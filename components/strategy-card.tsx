"use client";

import React, { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { StrategyCard as StrategyCardType } from "@/lib/data/strategy-cards";

interface StrategyCardProps {
  card: StrategyCardType;
  size?: "default" | "large";
  onThemeClick?: (theme: string) => void;
}

function formatPrompt(promptText: string, size: "default" | "large"): React.ReactNode[] {
  const lines = promptText.split('\n');
  const elements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  let inList = false;
  const spacerClass = size === "large" ? "h-5" : "h-3";
  const listClass = size === "large" ? "list-disc pl-6 my-3 space-y-2" : "list-disc pl-5 my-2 space-y-1";

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('* ')) {
      if (!inList) {
        inList = true;
        currentListItems = [];
      }
      currentListItems.push(<li key={`li-${index}`}>{trimmedLine.substring(2)}</li>);
    } else {
      if (inList) {
        elements.push(<ul key={`ul-${elements.length}`} className={listClass}>{currentListItems}</ul>);
        currentListItems = [];
        inList = false;
      }
      if (trimmedLine === '' && index > 0 && lines[index-1].trim() !== '' && !lines[index-1].trim().startsWith('* ')) {
        elements.push(<div key={`p-space-${index}`} className={spacerClass}></div>);
      } else if (trimmedLine !== '') {
        elements.push(trimmedLine);
        if (index < lines.length - 1 && lines[index+1].trim() !== '' && !lines[index+1].trim().startsWith('* ')) {
          elements.push(<br key={`br-${index}`} />);
        }
      }
    }
  });

  if (inList && currentListItems.length > 0) {
    elements.push(<ul key={`ul-${elements.length}`} className={listClass}>{currentListItems}</ul>);
  }

  return elements;
}

const themeColors: Record<string, string> = {
  Psychology: '#fffaed',
  Science: '#f0f8ff',
  Philosophy: '#f8f0ff',
  History: '#fff0f5',
  Art: '#f0fff0',
  Nature: '#f0ffff',
  Experimental: '#fff5e6',
  Politics: '#fff0f0',
  Religion: '#f8f8f8',
  Architecture: '#fff8ee',
  Chaotic: '#fff0e6',
  Anthropology: '#fdf5f0',
  Economics: '#f5f5ff',
  Mythology: '#fff8f0',
  Other: '#fafafa',
};

export function StrategyCard({ card, size = "default", onThemeClick }: StrategyCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const isLarge = size === "large";
  const bgColor = themeColors[card.theme] || themeColors.Other;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(card.prompt);
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className={isLarge ? "group" : "mb-10 group"}>
      <div className="flex-1">
        <div className={isLarge ? "mb-3" : "mb-2"}>
          <h2 className={`font-black font-sans ${isLarge ? "text-lg md:text-xl" : "text-xl"}`}>{card.title}</h2>
        </div>
        
        <div 
          onClick={copyToClipboard}
          className={`relative rounded-md font-mono leading-relaxed cursor-pointer transition-all 
                   hover:shadow-md active:translate-y-0.5 active:shadow-none whitespace-pre-line ${
                     isLarge ? "p-6 md:p-7 text-sm md:text-base" : "p-5 text-sm"
                   }`}
          style={{ 
            backgroundColor: bgColor,
            border: '1px solid transparent',
            transition: 'all 0.1s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
          }}
          aria-label={`Click to copy: ${card.prompt}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              copyToClipboard();
            }
          }}
        >
          {formatPrompt(card.prompt, size)}
          
          <div className={`absolute transition-opacity ${isLarge ? "right-4 top-4" : "right-3 top-3"} ${isCopied ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'}`}>
            {isCopied ? (
              <div className={`bg-green-500/10 border border-green-500 text-green-500 rounded-md p-1 flex items-center gap-1 font-sans ${isLarge ? "text-sm" : "text-xs"}`}>
                <CheckIcon className={isLarge ? "h-4 w-4" : "h-3.5 w-3.5"} />
                <span>Copied!</span>
              </div>
            ) : (
              <div className="bg-white/70 border rounded-md p-1 flex items-center justify-center">
                <CopyIcon className={isLarge ? "h-4 w-4" : "h-3.5 w-3.5"} />
              </div>
            )}
          </div>
        </div>
        {card.theme && (
          <div className={`flex justify-end ${isLarge ? "mt-3" : "mt-2"}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onThemeClick?.(card.theme);
              }}
              className="text-xs font-mono text-muted-foreground/40 hover:text-muted-foreground hover:underline transition-colors cursor-pointer"
            >
              {card.theme}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
