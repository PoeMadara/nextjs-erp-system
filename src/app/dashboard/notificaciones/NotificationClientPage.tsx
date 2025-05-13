
"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search, Send, Play, Pause } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import type { NotificationConfig, NotificationTargetRole } from '@/types';
import { getNotificationConfigs, deleteNotificationConfig, sendNotificationByConfig, updateNotificationConfig } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 10;

export default function NotificationClientPage() {
  const [configs, setConfigs] = useState<NotificationConfig[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSending, setIsSending] = useState<string | null>(null); // Stores ID of config being sent
  const [isToggling, setIsToggling] = useState<string | null>(null); // Stores ID of config being toggled
  const [configToDelete, setConfigToDelete] = useState<NotificationConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();

  const fetchConfigs = async () => {
    setIsLoading(true);
    try {
      const data = await getNotificationConfigs();
      setConfigs(data);
    } catch (error) {
      toast({ title: t('common.error'), description: t('notifications.failFetch'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, [toast, t]);

  const filteredConfigsData = useMemo(() => {
    return configs.filter(config =>
      config.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [configs, searchTerm]);

  const totalPages = Math.ceil(filteredConfigsData.length / ITEMS_PER_PAGE);

  const paginatedConfigs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredConfigsData.slice(startIndex, endIndex);
  }, [filteredConfigsData, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage > 1) {
        setCurrentPage(1);
    }
  }, [searchTerm, totalPages, currentPage]);

  const handleDeleteConfig = async () => {
    if (!configToDelete || !user) {
        toast({ title: t('common.error'), description: !configToDelete ? t('notifications.configNotFound') : "User not authenticated.", variant: "destructive" });
        return;
    }
    setIsDeleting(true);
    try {
      await deleteNotificationConfig(configToDelete.id, user.id, t);
      fetchConfigs(); // Re-fetch to update list
      toast({ title: t('common.success'), description: t('notifications.successDelete', { title: configToDelete.title }) });
    } catch (error) {
      toast({ title: t('common.error'), description: t('notifications.failDelete', { title: configToDelete.title }), variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setConfigToDelete(null);
    }
  };

  const openDeleteDialog = (config: NotificationConfig) => {
    setConfigToDelete(config);
  };

  const handleSendNow = async (configId: string) => {
    if (!user) {
      toast({ title: t('common.error'), description: "User not authenticated.", variant: "destructive" });
      return;
    }
    setIsSending(configId);
    try {
      const result = await sendNotificationByConfig(configId, user.id, t);
      if(result.success) {
        toast({ title: t('common.success'), description: result.message || t('notifications.sentSuccessGeneric') });
        fetchConfigs(); // To update lastSent
      } else {
        toast({ title: t('common.error'), description: result.message || t('notifications.sentFailGeneric'), variant: "destructive" });
      }
    } catch (error) {
       toast({ title: t('common.error'), description: t('notifications.sentFailGeneric'), variant: "destructive" });
    } finally {
      setIsSending(null);
    }
  }

  const handleToggleEnable = async (config: NotificationConfig) => {
     if (!user) {
      toast({ title: t('common.error'), description: "User not authenticated.", variant: "destructive" });
      return;
    }
    setIsToggling(config.id);
    try {
        await updateNotificationConfig(config.id, { isEnabled: !config.isEnabled }, user.id, t);
        toast({ title: t('common.success'), description: t(config.isEnabled ? 'notifications.disabledSuccess' : 'notifications.enabledSuccess', {title: config.title}) });
        fetchConfigs();
    } catch (error) {
        toast({ title: t('common.error'), description: t('notifications.toggleFail', {title: config.title}), variant: "destructive" });
    } finally {
        setIsToggling(null);
    }
  };
  
  const getTargetRolesText = (roles: NotificationTargetRole[]) => {
    if (roles.includes('all')) return t('notifications.targetAll');
    return roles.map(role => t(`notifications.targetRole.${role}`)).join(', ');
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title={t('notifications.titleManagement')} description={t('common.loading')} actionButton={<Skeleton className="h-10 w-36" />} />
        <div className="mb-4">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(6)].map((_, i) => <TableHead key={i}><Skeleton className="h-6 w-24" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t('notifications.titleManagement')}
        description={t('notifications.descriptionManagement')}
        actionButton={
          <Button asChild className="shadow-sm">
            <Link href="/dashboard/notificaciones/new">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('notifications.addNewConfigButton')}
            </Link>
          </Button>
        }
      />

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('notifications.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md pl-10 shadow-sm"
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('notifications.tableTitle')}</TableHead>
              <TableHead>{t('notifications.tableTargetAudience')}</TableHead>
              <TableHead>{t('notifications.tableFrequency')}</TableHead>
              <TableHead>{t('notifications.tableLastSent')}</TableHead>
              <TableHead>{t('notifications.tableStatus')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedConfigs.length > 0 ? (
              paginatedConfigs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.title}</TableCell>
                  <TableCell>{getTargetRolesText(config.targetRoles)}</TableCell>
                  <TableCell>
                    {config.frequency === 'once' ? t('notifications.frequencyOnce') : t('notifications.frequencyRecurring', {days: config.recurringDays})}
                    {config.frequency === 'recurring' && (
                       <Badge variant={config.isEnabled ? "default" : "outline"} className={`ml-2 ${config.isEnabled ? 'bg-green-500 hover:bg-green-600' : ''}`}>
                        {config.isEnabled ? t('notifications.statusEnabled') : t('notifications.statusDisabled')}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{config.lastSent ? format(new Date(config.lastSent), 'Pp') : t('notifications.neverSent')}</TableCell>
                  <TableCell>
                    <Badge variant={config.isEnabled ? 'default' : 'destructive'} className={config.isEnabled ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {config.isEnabled ? t('notifications.statusEnabled') : t('notifications.statusDisabled')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t('common.actions')}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/notificaciones/${config.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> {t('common.edit')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendNow(config.id)} disabled={isSending === config.id}>
                          <Send className="mr-2 h-4 w-4" /> {isSending === config.id ? t('notifications.sendingNow') : t('notifications.sendNow')}
                        </DropdownMenuItem>
                         {config.frequency === 'recurring' && (
                           <DropdownMenuItem onClick={() => handleToggleEnable(config)} disabled={isToggling === config.id}>
                            {config.isEnabled ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isToggling === config.id ? t('common.saving') : (config.isEnabled ? t('notifications.disableRecurring') : t('notifications.enableRecurring'))}
                          </DropdownMenuItem>
                         )}
                        <DropdownMenuItem onClick={() => openDeleteDialog(config)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm ? t('notifications.noConfigsFound') : t('common.loading')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={filteredConfigsData.length}
      />

      <AlertDialog open={!!configToDelete} onOpenChange={() => setConfigToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('notifications.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('notifications.deleteDialogDescription', { title: configToDelete?.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfig} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
