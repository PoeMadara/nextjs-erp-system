'use client';
import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
