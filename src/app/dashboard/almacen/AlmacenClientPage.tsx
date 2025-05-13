
"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search, Warehouse as WarehouseIcon } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import type { Almacen } from '@/types';
import { getAlmacenes, deleteAlmacen as deleteAlmacenApi } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';

export default function AlmacenClientPage() {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [almacenToDelete, setAlmacenToDelete] = useState<Almacen | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAlmacenes() {
      setIsLoading(true);
      try {
        const data = await getAlmacenes();
        setAlmacenes(data);
      } catch (error) {
        toast({ title: t('common.error'), description: t('warehouse.failFetch'), variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchAlmacenes();
  }, [toast, t]);

  const filteredAlmacenes = useMemo(() => {
    return almacenes.filter(almacen =>
      almacen.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (almacen.ubicacion && almacen.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (almacen.capacidad && almacen.capacidad.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [almacenes, searchTerm]);

  const handleDeleteAlmacen = async () => {
    if (!almacenToDelete || !user) {
      toast({ title: t('common.error'), description: t('warehouse.failDelete', {name: almacenToDelete?.nombre || ''}), variant: "destructive" });
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAlmacenApi(almacenToDelete.id, user.id, t); 
      setAlmacenes(prev => prev.filter(a => a.id !== almacenToDelete.id));
      toast({ title: t('common.success'), description: t('warehouse.successDelete', { name: almacenToDelete.nombre }) });
    } catch (error) {
      toast({ title: t('common.error'), description: t('warehouse.failDelete', { name: almacenToDelete.nombre }), variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setAlmacenToDelete(null);
    }
  };

  const openDeleteDialog = (almacen: Almacen) => {
    setAlmacenToDelete(almacen);
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title={t('warehouse.title')} description={t('common.loading')} actionButton={<Skeleton className="h-10 w-40" />} />
        <div className="mb-4">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(5)].map((_, i) => <TableHead key={i}><Skeleton className="h-6 w-24" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}
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
        title={t('warehouse.title')}
        description={t('warehouse.description')}
        actionButton={
          <Button asChild className="shadow-sm">
            <Link href="/dashboard/almacen/new">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('warehouse.addNewWarehouseButton')}
            </Link>
          </Button>
        }
      />

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('warehouse.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-10 shadow-sm"
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('warehouse.tableId')}</TableHead>
              <TableHead>{t('warehouse.tableName')}</TableHead>
              <TableHead>{t('warehouse.tableLocation')}</TableHead>
              <TableHead>{t('warehouse.tableCapacity')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlmacenes.length > 0 ? (
              filteredAlmacenes.map((almacen) => (
                <TableRow key={almacen.id}>
                  <TableCell className="font-medium">{almacen.id}</TableCell>
                  <TableCell>{almacen.nombre}</TableCell>
                  <TableCell>{almacen.ubicacion || '-'}</TableCell>
                  <TableCell>{almacen.capacidad || '-'}</TableCell>
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
                           <Link href={`/dashboard/almacen/${almacen.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> {t('common.edit')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(almacen)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t('warehouse.noWarehousesFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!almacenToDelete} onOpenChange={() => setAlmacenToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('warehouse.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('warehouse.deleteDialogDescription', { name: almacenToDelete?.nombre })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAlmacen} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

