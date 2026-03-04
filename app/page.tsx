"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { getStrategyCards } from "@/lib/data/strategy-cards";
import { StrategyCard } from "@/components/strategy-card";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, Search } from "lucide-react";

export default function Home() {
  const strategyCards = useMemo(() => getStrategyCards(), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const shuffled = useMemo(() => {
    const cards = [...strategyCards];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }, [strategyCards]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const card of strategyCards) {
      const t = card.theme || "Other";
      counts[t] = (counts[t] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [strategyCards]);

  const filteredCards = useMemo(() => {
    let cards = strategyCards;
    if (activeCategory) {
      cards = cards.filter(c => (c.theme || "Other") === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      cards = cards.filter(card =>
        card.title.toLowerCase().includes(q) ||
        card.prompt.toLowerCase().includes(q) ||
        (card.theme && card.theme.toLowerCase().includes(q))
      );
    }
    return cards;
  }, [strategyCards, searchQuery, activeCategory]);

  useEffect(() => {
    document.body.style.backgroundColor = '#f9f9f9';
  }, []);

  useEffect(() => {
    if (browseOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [browseOpen]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % shuffled.length);
  }, [shuffled.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + shuffled.length) % shuffled.length);
  }, [shuffled.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (browseOpen) {
        if (e.key === "Escape") setBrowseOpen(false);
        return;
      }
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev, browseOpen]);

  const currentCard = shuffled[currentIndex];

  const openBrowseWithTheme = useCallback((theme: string) => {
    setActiveCategory(theme);
    setSearchQuery("");
    setBrowseOpen(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="pt-6 pb-2">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between max-w-4xl">
          <p className="font-mono text-sm text-muted-foreground">
            <span className="font-bold text-foreground">generative strategies</span> are prompts for lateral thinking.
          </p>
          <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground mt-2 md:mt-0">
            <Link href="/about" className="hover:text-foreground hover:underline transition-all active:translate-y-0.5">
              learn more
            </Link>
            <span className="text-muted-foreground/30">|</span>
            <button
              onClick={() => { setBrowseOpen(true); setSearchQuery(""); setActiveCategory(null); }}
              className="hover:text-foreground hover:underline transition-all active:translate-y-0.5 cursor-pointer"
            >
              browse all
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 md:px-8 pt-[15vh]">
        <div className="w-full max-w-3xl relative">
          <button
            onClick={goPrev}
            className="absolute -left-14 md:-left-20 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full text-muted-foreground/40 hover:text-foreground hover:bg-black/5 transition-all active:translate-y-0.5 cursor-pointer hidden md:block"
            style={{ position: 'fixed', top: '50%', left: 'max(1rem, calc(50% - 28rem))' }}
            aria-label="Previous card"
          >
            <ChevronLeft className="h-8 w-8 md:h-10 md:w-10" strokeWidth={1.5} />
          </button>

          <div className="min-w-0">
            {currentCard && <StrategyCard card={currentCard} size="large" onThemeClick={openBrowseWithTheme} />}
          </div>

          <button
            onClick={goNext}
            className="absolute -right-14 md:-right-20 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full text-muted-foreground/40 hover:text-foreground hover:bg-black/5 transition-all active:translate-y-0.5 cursor-pointer hidden md:block"
            style={{ position: 'fixed', top: '50%', right: 'max(1rem, calc(50% - 28rem))' }}
            aria-label="Next card"
          >
            <ChevronRight className="h-8 w-8 md:h-10 md:w-10" strokeWidth={1.5} />
          </button>
        </div>
      </main>


      {browseOpen && (
        <div className="fixed inset-0 z-50 bg-[#f9f9f9] flex flex-col">
          <div className="shrink-0 bg-[#f9f9f9]/95 backdrop-blur-sm border-b border-black/5">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search strategies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setBrowseOpen(false)}
                className="shrink-0 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 transition-all active:translate-y-0.5 cursor-pointer"
                aria-label="Close browse view"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex max-w-6xl mx-auto w-full">
            <nav className="shrink-0 w-48 overflow-y-auto py-6 pl-4 pr-2 hidden md:block">
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-mono transition-colors flex items-center justify-between ${
                  activeCategory === null ? "bg-black/5 text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03]"
                }`}
              >
                <span>All</span>
                <span className="text-muted-foreground/60 text-xs">{strategyCards.length}</span>
              </button>
              {categories.map(([name, count]) => (
                <button
                  key={name}
                  onClick={() => setActiveCategory(name)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-mono transition-colors flex items-center justify-between ${
                    activeCategory === name ? "bg-black/5 text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-black/[0.03]"
                  }`}
                >
                  <span>{name}</span>
                  <span className="text-muted-foreground/60 text-xs">{count}</span>
                </button>
              ))}
            </nav>

            <div className="flex-1 overflow-y-auto py-8 px-4 md:px-8">
              <div className="max-w-3xl">
                {filteredCards.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground font-mono">no matches found</p>
                  </div>
                ) : (
                  filteredCards.map((card, index) => (
                    <StrategyCard key={index} card={card} onThemeClick={(theme) => setActiveCategory(theme)} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
