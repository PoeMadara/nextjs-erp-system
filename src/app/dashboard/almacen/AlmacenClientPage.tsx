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
import { getAlmacenes } from '@/lib/mockData'; // Assuming deleteAlmacen will be added later
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'; // For delete functionality

export default function AlmacenClientPage() {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // const [isDeleting, setIsDeleting] = useState(false);
  // const [almacenToDelete, setAlmacenToDelete] = useState<Almacen | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

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
      (almacen.ubicacion && almacen.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [almacenes, searchTerm]);

  // const handleDeleteAlmacen = async () => {
  //   if (!almacenToDelete) return;
  //   setIsDeleting(true);
  //   try {
  //     // await deleteAlmacenApi(almacenToDelete.id); // This function needs to be created in mockData.ts
  //     setAlmacenes(prev => prev.filter(a => a.id !== almacenToDelete.id));
  //     toast({ title: t('common.success'), description: `Almacén ${almacenToDelete.nombre} eliminado.` });
  //   } catch (error) {
  //     toast({ title: t('common.error'), description: `Error al eliminar almacén ${almacenToDelete.nombre}.`, variant: "destructive" });
  //   } finally {
  //     setIsDeleting(false);
  //     setAlmacenToDelete(null);
  //   }
  // };

  // const openDeleteDialog = (almacen: Almacen) => {
  //   setAlmacenToDelete(almacen);
  // };

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
                {[...Array(4)].map((_, i) => <TableHead key={i}><Skeleton className="h-6 w-24" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(4)].map((_, j) => <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>)}
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
          <Button asChild className="shadow-sm" disabled>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t('common.actions')}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled> {/* Replace with Link for edit page when created */}
                          <Edit className="mr-2 h-4 w-4" /> {t('common.edit')} ({t('common.underConstruction').toLowerCase()})
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          {/* onClick={() => openDeleteDialog(almacen)} */}
                          <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')} ({t('common.underConstruction').toLowerCase()})
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  {t('warehouse.noWarehousesFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* <AlertDialog open={!!almacenToDelete} onOpenChange={() => setAlmacenToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the warehouse "{almacenToDelete?.nombre}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAlmacen} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  );
}
