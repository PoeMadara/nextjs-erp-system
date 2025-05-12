"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import type { Proveedor } from '@/types';
import { getProveedores, deleteProveedor as deleteProveedorApi } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';

export default function ProveedorClientPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState<Proveedor | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchProveedores() {
      setIsLoading(true);
      try {
        const data = await getProveedores();
        setProveedores(data);
      } catch (error) {
        toast({ title: t('common.error'), description: t('suppliers.failFetch'), variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProveedores();
  }, [toast, t]);

  const filteredProveedores = useMemo(() => {
    return proveedores.filter(proveedor =>
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.nif.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [proveedores, searchTerm]);

  const handleDeleteProveedor = async () => {
    if (!proveedorToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProveedorApi(proveedorToDelete.id);
      setProveedores(prev => prev.filter(p => p.id !== proveedorToDelete.id));
      toast({ title: t('common.success'), description: t('suppliers.successDelete', { name: proveedorToDelete.nombre }) });
    } catch (error) {
      toast({ title: t('common.error'), description: t('suppliers.failDelete', { name: proveedorToDelete.nombre }), variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setProveedorToDelete(null);
    }
  };

  const openDeleteDialog = (proveedor: Proveedor) => {
    setProveedorToDelete(proveedor);
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title={t('suppliers.title')} description={t('common.loading')} actionButton={<Skeleton className="h-10 w-36" />} />
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
        title={t('suppliers.title')}
        description={t('suppliers.description')}
        actionButton={
          <Button asChild className="shadow-sm">
            <Link href="/dashboard/proveedores/new">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('suppliers.addNewSupplierButton')}
            </Link>
          </Button>
        }
      />

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('suppliers.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-10 shadow-sm"
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('suppliers.tableId')}</TableHead>
              <TableHead>{t('suppliers.tableName')}</TableHead>
              <TableHead>{t('suppliers.tableNif')}</TableHead>
              <TableHead>{t('suppliers.tableEmail')}</TableHead>
              <TableHead>{t('suppliers.tablePhone')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProveedores.length > 0 ? (
              filteredProveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell className="font-medium">{proveedor.id}</TableCell>
                  <TableCell>{proveedor.nombre}</TableCell>
                  <TableCell>{proveedor.nif}</TableCell>
                  <TableCell>{proveedor.email}</TableCell>
                  <TableCell>{proveedor.telefono || '-'}</TableCell>
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
                          <Link href={`/dashboard/proveedores/${proveedor.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> {t('common.edit')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(proveedor)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
                  {t('suppliers.noSuppliersFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!proveedorToDelete} onOpenChange={() => setProveedorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('suppliers.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('suppliers.deleteDialogDescription', { name: proveedorToDelete?.nombre })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProveedor} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
