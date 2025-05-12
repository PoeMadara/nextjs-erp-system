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
import type { Cliente } from '@/types';
import { getClientes, deleteCliente as deleteClienteApi } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';

export default function ClienteClientPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchClientes() {
      setIsLoading(true);
      try {
        const data = await getClientes();
        setClientes(data);
      } catch (error) {
        toast({ title: t('common.error'), description: t('clientes.failFetch'), variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchClientes();
  }, [toast, t]);

  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.nif && cliente.nif.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [clientes, searchTerm]);

  const handleDeleteCliente = async () => {
    if (!clienteToDelete) return;
    setIsDeleting(true);
    try {
      await deleteClienteApi(clienteToDelete.id);
      setClientes(prev => prev.filter(c => c.id !== clienteToDelete.id));
      toast({ title: t('common.success'), description: t('clientes.successDelete', { name: clienteToDelete.nombre }) });
    } catch (error) {
      toast({ title: t('common.error'), description: t('clientes.failDelete', { name: clienteToDelete.nombre }), variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setClienteToDelete(null);
    }
  };

  const openDeleteDialog = (cliente: Cliente) => {
    setClienteToDelete(cliente);
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title={t('clientes.title')} description={t('common.loading')} actionButton={<Skeleton className="h-10 w-32" />} />
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
        title={t('clientes.title')}
        description={t('clientes.description')}
        actionButton={
          <Button asChild className="shadow-sm">
            <Link href="/dashboard/clientes/new">
              <PlusCircle className="mr-2 h-4 w-4" /> {t('clientes.addNewClienteButton')}
            </Link>
          </Button>
        }
      />

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('clientes.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-10 shadow-sm"
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('clientes.tableId')}</TableHead>
              <TableHead>{t('clientes.tableName')}</TableHead>
              <TableHead>{t('clientes.tableNif')}</TableHead>
              <TableHead>{t('clientes.tableEmail')}</TableHead>
              <TableHead>{t('clientes.tablePhone')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClientes.length > 0 ? (
              filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.id}</TableCell>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.nif}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefono || '-'}</TableCell>
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
                          <Link href={`/dashboard/clientes/${cliente.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> {t('common.edit')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(cliente)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
                  {t('clientes.noClientesFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!clienteToDelete} onOpenChange={() => setClienteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('clientes.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('clientes.deleteDialogDescription', { name: clienteToDelete?.nombre })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCliente} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
