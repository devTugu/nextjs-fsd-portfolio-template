export interface TechStackItem {
  id: string;
  name: string;
}

/** Core technologies used across the portfolio platform (frontend + backend). */
export const TECH_STACK: TechStackItem[] = [
  { id: 'nextjs', name: 'Next.js' },
  { id: 'react', name: 'React' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'nestjs', name: 'NestJS' },
  { id: 'tailwind', name: 'Tailwind CSS' },
  { id: 'mysql', name: 'MySQL' },
  { id: 'redis', name: 'Redis' },
];
