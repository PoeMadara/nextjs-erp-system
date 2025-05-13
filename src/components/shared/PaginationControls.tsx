
"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationControlsProps) {
  const { t } = useTranslation();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 0) { // Also handle case where totalItems is 0
    return null;
  }

  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 sm:gap-0">
      <p className="text-sm text-muted-foreground">
        {totalItems > 0 ? t('pagination.showing', { start: startItem, end: endItem, total: totalItems }) : ""}
      </p>
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            aria-label={t('pagination.previous')}
          >
            <ChevronLeft className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">{t('pagination.previous')}</span>
          </Button>
          <span className="text-sm text-muted-foreground px-2 py-1 border rounded-md bg-background">
            {t('pagination.pageOf', { currentPage, totalPages })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label={t('pagination.next')}
          >
            <span className="hidden sm:inline">{t('pagination.next')}</span>
            <ChevronRight className="h-4 w-4 sm:ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
