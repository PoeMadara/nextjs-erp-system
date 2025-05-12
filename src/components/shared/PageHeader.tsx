import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: ReactNode;
}

export function PageHeader({ title, description, actionButton }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        {actionButton && <div>{actionButton}</div>}
      </div>
    </div>
  );
}
