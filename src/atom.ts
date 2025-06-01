import { atom } from 'jotai';

export const locationsAtom = atom<{ name: string; explanation: string }[]>([]);
export const visiblePointsAtom = atom<{ lat: number; lng: number }[]>([]);
// Export all constants declared in this file
export * from './atom';
