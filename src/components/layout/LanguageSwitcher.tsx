'use client';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <>
      <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}>
         <Globe className="mr-2 h-4 w-4" />
        <span>{t('userNav.english')}</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setLanguage('es')} disabled={language === 'es'}>
         <Globe className="mr-2 h-4 w-4" />
        <span>{t('userNav.spanish')}</span>
      </DropdownMenuItem>
    </>
  );
}
