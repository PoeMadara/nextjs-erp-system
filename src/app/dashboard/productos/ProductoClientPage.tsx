
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
import type { Producto } from '@/types';
import { getProductos, deleteProducto as deleteProductoApi } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { PaginationControls } from '@/components/shared/PaginationControls';

const ITEMS_PER_PAGE = 25;

export default function ProductoClientPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<Producto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchProductos() {
      setIsLoading(true);
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        toast({ title: t('common.error'), description: t('products.failFetch'), variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProductos();
  }, [toast, t]);

  const filteredProductosData = useMemo(() => {
    return productos.filter(producto =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (producto.codigo && producto.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (producto.referencia && producto.referencia.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (producto.categoria && producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [productos, searchTerm]);

  const totalPages = Math.ceil(filteredProductosData.length / ITEMS_PER_PAGE);

  const paginatedProductos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProductosData.slice(startIndex, endIndex);
  }, [filteredProductosData, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage > 1) {
        setCurrentPage(1);
    }
  }, [searchTerm, totalPages, currentPage]);

  const handleDeleteProducto = async () => {
    if (!productoToDelete || !user) {
        toast({ title: t('common.error'), description: !productoToDelete ? t('products.notFound') : "User not authenticated.", variant: "destructive" });
        return;
    }
    setIsDeleting(true);
    try {
      await deleteProductoApi(productoToDelete.id, user.id, t);
      const updatedProductos = productos.filter(p => p.id !== productoToDelete.id);
      setProductos(updatedProductos);

      const newFilteredData = updatedProductos.filter(producto =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (producto.codigo && producto.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (producto.referencia && producto.referencia.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (producto.categoria && producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      const newTotalPages = Math.ceil(newFilteredData.length / ITEMS_PER_PAGE);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) { 
        setCurrentPage(1);
      } else {
         const itemsOnCurrentPage = newFilteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).length;
        if (itemsOnCurrentPage === 0 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
      }

      toast({ title: t('common.success'), description: t('products.successDelete', { name: productoToDelete.nombre }) });
    } catch (error) {
      toast({ title: t('common.error'), description: t('products.failDelete', { name: productoToDelete.nombre }), variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setProductoToDelete(null);
    }
  };

  const openDeleteDialog = (producto: Producto) => {
    setProductoToDelete(producto);
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title={t('products.title')} description={t('common.loading')} actionButton={<Skeleton className="h-10 w-36" />} />
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
        title={t('products.title')}
        description={t('products.description')}
        actionButton={
          <Button asChild className="shadow-sm">
            <Link href="/dashboard/productos/new">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('products.addNewProductButton')}
            </Link>
          </Button>
        }
      />

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('products.searchPlaceholder')}
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
              <TableHead>{t('products.tableCode')}</TableHead>
              <TableHead>{t('products.tableRef')}</TableHead>
              <TableHead>{t('products.tableName')}</TableHead>
              <TableHead>{t('products.tableCategory')}</TableHead>
              <TableHead className="text-right">{t('products.tablePrice')}</TableHead>
              <TableHead className="text-right">{t('products.tableStock')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProductos.length > 0 ? (
              paginatedProductos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell className="font-medium">{producto.codigo}</TableCell>
                  <TableCell>{producto.referencia || '-'}</TableCell>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>{producto.categoria ? <Badge variant="outline">{producto.categoria}</Badge> : '-'}</TableCell>
                  <TableCell className="text-right">${producto.precioVenta.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{producto.stock}</TableCell>
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
                          <Link href={`/dashboard/productos/${producto.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> {t('common.edit')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(producto)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {searchTerm ? t('products.noProductsFound') : t('common.loading')}
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
        totalItems={filteredProductosData.length}
      />

      <AlertDialog open={!!productoToDelete} onOpenChange={() => setProductoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('products.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('products.deleteDialogDescription', { name: productoToDelete?.nombre })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProducto} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
