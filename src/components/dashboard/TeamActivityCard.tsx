
"use client";
import { useEffect, useState } from 'react';
import type { TeamActivityLog } from '@/types';
import { getTeamActivityLogs } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from '@/hooks/useTranslation';
import { Users, FileText, ShoppingCart, Package, Briefcase, Settings } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const getModuleIcon = (module: TeamActivityLog['modulo']) => {
  switch (module) {
    case 'Facturación': return <FileText className="h-4 w-4 text-muted-foreground" />;
    case 'Compras': return <ShoppingCart className="h-4 w-4 text-muted-foreground" />;
    case 'Productos': return <Package className="h-4 w-4 text-muted-foreground" />;
    case 'Clientes': return <Users className="h-4 w-4 text-muted-foreground" />;
    case 'Proveedores': return <Users className="h-4 w-4 text-muted-foreground" />;
    case 'Empleados': return <Briefcase className="h-4 w-4 text-muted-foreground" />;
    case 'Sistema': return <Settings className="h-4 w-4 text-muted-foreground" />;
    default: return <Users className="h-4 w-4 text-muted-foreground" />;
  }
};

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};


export function TeamActivityCard() {
  const [activities, setActivities] = useState<TeamActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    async function fetchActivities() {
      setIsLoading(true);
      try {
        const data = await getTeamActivityLogs(7); // Fetch more for scrolling
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch team activities:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchActivities();
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4 mt-1" />
        </CardHeader>
        <CardContent className="h-[300px] p-0">
          <div className="space-y-4 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
         <CardFooter className="p-4 border-t">
           <Skeleton className="h-9 w-24 ml-auto" />
        </CardFooter>
      </Card>
    );
  }


  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{t('dashboardPage.teamActivityTitle')}</CardTitle>
        <CardDescription>{t('dashboardPage.teamActivityDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <ul className="divide-y divide-border">
            {activities.length > 0 ? activities.map((activity) => (
              <li key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 border-2" style={{ borderColor: activity.avatar_color }}>
                     <AvatarFallback style={{ backgroundColor: activity.avatar_color, color: '#fff', fontWeight: 'bold' }}>
                        {getInitials(activity.nombre_usuario)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium" style={{ color: activity.avatar_color }}>{activity.nombre_usuario}</span>{' '}
                      <span className="text-muted-foreground">{activity.descripcion}</span>
                    </p>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                       {getModuleIcon(activity.modulo)}
                       <span>{t(`teamActivity.module.${activity.modulo.toLowerCase().replace('ó', 'o').replace('é', 'e')}`)}</span>
                       <span className="mx-1">&bull;</span>
                       <span>
                        {formatDistanceToNow(parseISO(activity.timestamp), {
                          addSuffix: true,
                          locale: language === 'es' ? es : enUS,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            )) : (
                <li className="p-4 text-center text-muted-foreground">{t('dashboardPage.noTeamActivity')}</li>
            )}
          </ul>
        </ScrollArea>
      </CardContent>
      {activities.length > 0 && (
        <CardFooter className="p-4 border-t">
            <Button variant="outline" size="sm" className="ml-auto">
             {t('dashboardPage.viewAllActivity')}
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
