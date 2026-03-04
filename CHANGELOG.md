2026-02-26
- pinned card to fixed vertical position (15vh from top) so titles stay in place when navigating between cards
- moved theme tag to bottom-right of card, clicking it opens browse overlay filtered to that category
- colored card text areas by theme using the original category color palette (Psychology khaki, Science blue, Philosophy purple, etc.)
- fixed navigation arrows to viewport center so they stay in place regardless of card height
- scaled down the single-card view — smaller title, body text, padding, and narrower container for a more refined proportion
- added top bar with monospace "**generative strategies** are prompts for lateral thinking." on the left, "learn more | browse all" links on the right, removed footer
- added category sidebar to browse overlay — stacked list on the left with counts (e.g. "Architecture 2"), highlights active filter, "All" at top, hidden on mobile
- added "browse all" overlay — full-screen view of all cards with search, opens from footer link, dismissible with X button or Escape key, body scroll locked while open
- removed logo and header from homepage — card is now fully centered in the viewport, "what is this?" link moved to footer
- redesigned homepage as a single-card carousel — removed filters/search, one card centered with left/right arrow navigation (plus keyboard arrows), cards shuffled on load, scaled up text and padding for the focused view
- added 44 new strategy cards from batch 2 candidates (docs/strategy-candidates-batch2.md) — dataset now at 245 cards, spanning domains like cooking, film, mathematics, medicine, forensics, ceramics, dance, and more
- added press/depress micro-interaction on strategy card text areas — cards subtly shift down on click for tactile feedback (active:translate-y-0.5)
- upgraded Next.js from 15.3.2 to 15.5.12 to fix localStorage SSR crash with Node.js 25 — consolidated next.config.ts as the single config file with devIndicators disabled
- updated strategy card dataset from docs/strategy-cards-data-source.json — now 201 cards (up from 186), with 34 new cards added, 19 retired, and 2 prompts revised

2024-12-20
- added comprehensive search functionality that searches titles, prompts, themes, and tags dynamically with real-time results counter
- created dedicated about page with project description, NYT attribution, and contributor credits - accessible via "what is this?" navigation
- implemented custom logo with transparent background using ImageMagick processing and replaced main heading
- updated app typography to use Lato font family instead of Geist for improved readability and brand consistency
- enhanced visual hierarchy with bolder headings (font-black) and buttons (font-bold) while maintaining appropriate tag weights
- redesigned navigation system with "queral.studio • what is this?" header and footer attribution "a project by Luis Queral — queral.studio"
- added elegant gradient fade effect at bottom of pages that transitions background colors smoothly to white before footer
- improved spacing and layout throughout with tighter logo-to-content spacing and better visual flow
- maintained responsive design and accessibility while implementing custom branding elements 