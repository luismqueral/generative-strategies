export interface StrategyCard {
  title: string;
  prompt: string;
  theme: string;
  tag: string;
  context?: string;
}

interface RawStrategyCard {
  title: string;
  prompt: string;
  theme?: string;
  tag?: string;
  context?: string;
  source_inspiration?: string;
}

import strategiesData from '../../strategy-cards-data-source.json';

export function getStrategyCards(): StrategyCard[] {
  try {
    return strategiesData.map((card: RawStrategyCard) => ({
      title: card.title,
      prompt: card.prompt,
      theme: card.theme || '',
      tag: card.tag || card.source_inspiration || '',
      context: card.context || undefined,
    }));
  } catch (error) {
    console.error('Error loading strategy cards data:', error);
    return [];
  }
}
