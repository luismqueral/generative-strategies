"use client";

import { useState, useMemo, useEffect } from "react";
import { getStrategyCards } from "@/lib/data/strategy-cards";
import { StrategyCard } from "@/components/strategy-card";
import Image from "next/image";
import Link from "next/link";
import { X, Search, ChevronDown } from "lucide-react";

const themeColors: Record<string, string> = {
  Featured: '#f9f9f9',
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

export default function Home() {
  const strategyCards = useMemo(() => getStrategyCards(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Featured");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const card of strategyCards) {
      const t = card.theme || "Other";
      counts[t] = (counts[t] || 0) + 1;
    }
    return counts;
  }, [strategyCards]);

  const categoryNames = useMemo(() => {
    return Object.keys(categoryCounts).sort();
  }, [categoryCounts]);

  const featuredCards = useMemo(() => {
    const featuredTitles = new Set([
      "Follow the Resistance",
      "Break the Container",
      "Embrace the Paradox",
      "Map the Negative Space",
      "Unfocus Your Eyes",
      "Do Nothing, Strategically",
      "Celebrate the Mistake",
      "Ask Until It Breaks",
      "Map the Adjacent Possible",
      "Employ the Pre-Mortem Analysis",
      "Reverse Engineer the Artifact",
      "Debug, Don't Delete",
      "Construct a Microworld",
      "Become the Bricoleur",
      "Name the QWERTY",
      "Build an Object-to-Think-With",
      "Shatter the Frame",
      "Invoke Occam's Razor",
      "Follow the Thread",
      "Pursue the Question",
      "Apply Kintsugi Philosophy",
      "Tell Its Story in Reverse",
      "Find the Keystone Habit",
      "Design for Desire Lines",
      "Ride the Horseless Carriage",
      "Let the Wrong Theory Teach",
      "Use the Wrong Map on Purpose",
      "Refuse the Easy Resolution",
      "Measure Twice",
      "Build the Jig First",
    ]);
    return strategyCards.filter(c => featuredTitles.has(c.title));
  }, [strategyCards]);

  const filteredCards = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return strategyCards.filter(card =>
        card.title.toLowerCase().includes(q) ||
        card.prompt.toLowerCase().includes(q) ||
        (card.theme && card.theme.toLowerCase().includes(q))
      );
    }

    if (activeCategory === "Featured") return featuredCards;
    if (activeCategory === "All") return strategyCards;
    return strategyCards.filter(c => (c.theme || "Other") === activeCategory);
  }, [strategyCards, searchQuery, activeCategory, featuredCards]);

  const pageBg = themeColors[activeCategory] || '#f9f9f9';

  useEffect(() => {
    document.body.style.backgroundColor = pageBg;
    document.body.style.transition = 'background-color 0.2s ease';
  }, [pageBg]);


  return (
    <div className="flex min-h-screen flex-col">
      <header className="py-8">
        <section className="container mx-auto px-4 max-w-3xl flex flex-col items-center text-center mb-4">
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 font-mono text-sm text-muted-foreground mb-6">
              <Link href="/about" className="hover:text-foreground hover:underline transition-all active:translate-y-0.5">
                what is this?
              </Link>
            </div>
            <Link href="/">
              <Image
                src="/generative-strategies-logo2-transparent.png"
                alt="Generative Strategy Cards"
                width={400}
                height={133}
                className="mx-auto mb-1 cursor-pointer transition-transform active:translate-y-0.5"
                priority
              />
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search all strategies..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value.trim()) setActiveCategory("All"); }}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-sans text-base"
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

            <div className="flex items-center justify-center gap-2">
              <label className="font-sans text-base text-muted-foreground">Filter by Category:</label>
              <div className="relative">
                <select
                  value={activeCategory}
                  onChange={(e) => { setActiveCategory(e.target.value); setSearchQuery(""); }}
                  className="appearance-none bg-transparent border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 font-sans text-base text-foreground font-medium hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="Featured">Featured ({featuredCards.length})</option>
                  <option value="All">All ({strategyCards.length})</option>
                  {categoryNames.map(name => (
                    <option key={name} value={name}>{name} ({categoryCounts[name]})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {searchQuery && (
              <p className="text-sm text-muted-foreground font-mono">
                {filteredCards.length} result{filteredCards.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
              </p>
            )}
          </div>
        </section>
      </header>

      <main className="flex-1 container mx-auto px-4 py-1">
        <div className="max-w-2xl mx-auto">
          {filteredCards.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-mono">no matches found</p>
            </div>
          ) : (
            filteredCards.map((card, index) => (
              <StrategyCard key={index} card={card} onThemeClick={(theme) => { setActiveCategory(theme); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            ))
          )}
        </div>
      </main>

      <footer className="py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground font-mono">
          <p>
            a project by Luis Queral — <a
              href="https://queral.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline"
            >
              queral.studio
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
