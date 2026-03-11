"use client";

import React from "react";
import { toast } from "sonner";
import { StrategyCard as StrategyCardType } from "@/lib/data/strategy-cards";

interface StrategyCardProps {
  card: StrategyCardType;
  onThemeClick?: (theme: string) => void;
}

function formatPrompt(promptText: string): React.ReactNode[] {
  const lines = promptText.split('\n');
  const elements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  let inList = false;

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
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 my-2 space-y-1">{currentListItems}</ul>);
        currentListItems = [];
        inList = false;
      }
      if (trimmedLine === '' && index > 0 && lines[index-1].trim() !== '' && !lines[index-1].trim().startsWith('* ')) {
        elements.push(<div key={`p-space-${index}`} className="h-3"></div>);
      } else if (trimmedLine !== '') {
        elements.push(trimmedLine);
        if (index < lines.length - 1 && lines[index+1].trim() !== '' && !lines[index+1].trim().startsWith('* ')) {
          elements.push(<br key={`br-${index}`} />);
        }
      }
    }
  });

  if (inList && currentListItems.length > 0) {
    elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 my-2 space-y-1">{currentListItems}</ul>);
  }

  return elements;
}

function renderContextWithLinks(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 decoration-foreground/25 hover:decoration-foreground/60 hover:text-foreground transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {match[1]}
      </a>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function StrategyCard({ card, onThemeClick }: StrategyCardProps) {
  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(card.prompt);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = card.prompt;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="mb-10 group">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-black font-sans">{card.title}</h2>
        {card.theme && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onThemeClick?.(card.theme);
            }}
            className="text-xs font-sans text-foreground/70 hover:text-foreground hover:underline transition-colors cursor-pointer shrink-0"
          >
            {card.theme}
          </button>
        )}
      </div>

      <div
        onClick={copyToClipboard}
        className="relative rounded-md p-5 font-mono text-sm leading-relaxed cursor-pointer transition-all hover:shadow-md active:translate-y-0.5 active:shadow-none whitespace-pre-line"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          border: '1px solid transparent',
          transition: 'all 0.1s ease-in-out'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
        aria-label={`Click to copy: ${card.prompt}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') copyToClipboard();
        }}
      >
        {formatPrompt(card.prompt)}
      </div>

      {card.context && (
        <div className="mt-3 flex items-start gap-2 px-1">
          <span className="text-sm leading-tight shrink-0">💡</span>
          <p className="text-sm font-sans text-foreground/70 leading-relaxed">
            {renderContextWithLinks(card.context)}
          </p>
        </div>
      )}
    </div>
  );
}
