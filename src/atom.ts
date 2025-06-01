import { atom } from 'jotai';

export const locationsAtom = atom<{ name: string; explanation: string }[]>([]);

// Export all constants declared in this file
export * from './atom';
