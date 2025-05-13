"use client";
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Search, UserX, UserCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import type { Empleado } from '@/types';
import { getEmpleados, deleteEmpleado as deleteEmpleadoApi, updateEmpleado } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export default function EmpleadoClientPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState<Empleado | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();

  const fetchEmpleados = async () => {
    setIsLoading(true);
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (error) {
      toast({ title: t('common.error'), description: t('employees.failFetch'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, [toast, t]);

  const filteredEmpleados = useMemo(() => {
    return empleados.filter(empleado =>
      empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [empleados, searchTerm]);

  const handleDeleteEmpleado = async () => {
    if (!empleadoToDelete || !user) {
        toast({ title: t('common.error'), description: !empleadoToDelete ? t('employees.notFound') : "User not authenticated.", variant: "destructive" });
        return;
    }
    setIsDeleting(true);
    try {
      await deleteEmpleadoApi(empleadoToDelete.id, user.id, t);
      setEmpleados(prev => prev.filter(e => e.id !== empleadoToDelete.id));
      toast({ title: t('common.success'), description: t('employees.successDelete', { name: empleadoToDelete.nombre }) });
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : t('employees.failDelete', { name: empleadoToDelete.nombre });
      toast({ title: t('common.error'), description: errorMessage, variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setEmpleadoToDelete(null);
    }
  };

  const openDeleteDialog = (empleado: Empleado) => {
    setEmpleadoToDelete(empleado);
  };
  
  const getRoleTranslation = (role: Empleado['role']) => {
    switch (role) {
      case 'admin': return t('employees.roleAdmin');
      case 'moderator': return t('employees.roleModerator');
      case 'user': return t('employees.roleUser');
      default: return role;
    }
  };

  const handleToggleBlockUser = async (empleado: Empleado) => {
    if (!user) {
      toast({ title: t('common.error'), description: "User not authenticated.", variant: "destructive" });
      return;
    }
    const newBlockedState = !empleado.isBlocked;
    try {
      await updateEmpleado(empleado.id, { isBlocked: newBlockedState }, user.id, t);
      toast({
        title: t('common.success'),
        description: newBlockedState 
          ? t('employees.successBlock', { name: empleado.nombre }) 
          : t('employees.successUnblock', { name: empleado.nombre }),
      });
      fetchEmpleados(); // Re-fetch to update list
    } catch (error) {
      toast({
        title: t('common.error'),
        description: newBlockedState 
          ? t('employees.failBlock', { name: empleado.nombre })
          : t('employees.failUnblock', { name: empleado.nombre }),
        variant: "destructive",
      });
    }
  };

  const canPerformAction = (targetEmployee: Empleado): boolean => {
    if (!user) return false;
    if (user.role === 'admin') {
        // Admins can manage anyone except themselves for blocking/deleting.
        // They can change their own role, but that's handled in the edit form.
        return user.id !== targetEmployee.id || targetEmployee.id === user.id; // Allows role edit for self, but not block/delete for self via this table
    }
    if (user.role === 'moderator') {
      // Moderators can manage users, but not admins or other moderators.
      return targetEmployee.role === 'user';
    }
    return false; // Users can't manage anyone.
  };

  const isSelf = (employeeId: string): boolean => {
    return user?.id === employeeId;
  }


  if (isLoading) {
    return (
      <>
        <PageHeader title={t('employees.title')} description={t('common.loading')} actionButton={<Skeleton className="h-10 w-40" />} />
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
        title={t('employees.title')}
        description={t('employees.description')}
        actionButton={
          user?.role === 'admin' ? (
            <Button asChild className="shadow-sm">
              <Link href="/dashboard/empleados/new">
                <PlusCircle className="mr-2 h-4 w-4" /> {t('employees.addNewEmployeeButton')}
              </Link>
            </Button>
          ) : null
        }
      />

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('employees.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-10 shadow-sm"
        />
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('employees.tableId')}</TableHead>
              <TableHead>{t('employees.tableName')}</TableHead>
              <TableHead>{t('employees.tableEmail')}</TableHead>
              <TableHead>{t('employees.tablePhone')}</TableHead>
              <TableHead>{t('employees.tableRole')}</TableHead>
              <TableHead>{t('common.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmpleados.length > 0 ? (
              filteredEmpleados.map((empleado) => (
                <TableRow key={empleado.id} className={empleado.isBlocked ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{empleado.id}</TableCell>
                  <TableCell>{empleado.nombre}</TableCell>
                  <TableCell>{empleado.email}</TableCell>
                  <TableCell>{empleado.telefono || '-'}</TableCell>
                  <TableCell><Badge variant={empleado.role === 'admin' ? 'default' : empleado.role === 'moderator' ? 'secondary' : 'outline'}>{getRoleTranslation(empleado.role)}</Badge></TableCell>
                  <TableCell>
                    {empleado.isBlocked ? (
                      <Badge variant="destructive">{t('employees.statusBlocked')}</Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">{t('employees.statusActive')}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {canPerformAction(empleado) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t('common.actions')}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/empleados/${empleado.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" /> {t('common.edit')}
                            </Link>
                          </DropdownMenuItem>
                          {!isSelf(empleado.id) && ( // Prevent blocking/deleting self
                            <>
                              <DropdownMenuItem onClick={() => handleToggleBlockUser(empleado)}>
                                {empleado.isBlocked ? (
                                  <UserCheck className="mr-2 h-4 w-4" />
                                ) : (
                                  <UserX className="mr-2 h-4 w-4" />
                                )}
                                {empleado.isBlocked ? t('employees.unblockUser') : t('employees.blockUser')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteDialog(empleado)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <Trash2 className="mr-2 h-4 w-4" /> {t('common.delete')}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t('employees.noEmployeesFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!empleadoToDelete} onOpenChange={() => setEmpleadoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('employees.deleteDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('employees.deleteDialogDescription', { name: empleadoToDelete?.nombre })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmpleado} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              {isDeleting ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
