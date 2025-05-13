"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { EmpleadoForm, type EmpleadoFormValues } from "@/components/crud/EmpleadoForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { getEmpleadoById, updateEmpleado } from "@/lib/mockData";
import type { Empleado } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";

export default function EditEmpleadoPage() {
  const { router } = useRouter();
  const { params } = useParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      const fetchEmpleado = async () => {
        setIsLoading(true);
        try {
          const data = await getEmpleadoById(id);
          if (data) {
            setEmpleado(data);
          } else {
            toast({ title: t('common.error'), description: t('employees.notFound'), variant: "destructive" });
            router.push("/dashboard/empleados");
          }
        } catch (error) {
          toast({ title: t('common.error'), description: t('employees.failFetchDetails'), variant: "destructive" });
          router.push("/dashboard/empleados");
        } finally {
          setIsLoading(false);
        }
      };
      fetchEmpleado();
    } else {
      toast({ title: t('common.error'), description: t('employees.invalidId'), variant: "destructive" });
      router.push("/dashboard/empleados"); 
    }
  }, [id, router, toast, t]);

  const handleSubmit = async (values: EmpleadoFormValues) => {
    if (!empleado || !user) {
      toast({ title: t('common.error'), description: !empleado ? t('employees.notFound') : "User not authenticated.", variant: "destructive" });
      return;
    }
    // Prevent non-admin from changing role of admin or self if not admin
    if (user.role !== 'admin') {
        if (empleado.role === 'admin' && values.role !== 'admin') {
            toast({ title: t('common.error'), description: "You cannot change the role of an administrator.", variant: "destructive" });
            return;
        }
        if (empleado.id === user.id && values.role !== user.role) {
             toast({ title: t('common.error'), description: "You cannot change your own role.", variant: "destructive" });
            return;
        }
    }


    setIsSubmitting(true);
    try {
      await updateEmpleado(empleado.id, values, user.id, t);
      toast({
        title: t('common.success'),
        description: t('employees.successUpdate', { name: values.nombre }),
      });
      router.push("/dashboard/empleados");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('employees.failUpdate'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <PageHeader 
          title={t('employees.editTitle')} 
          description={t('common.loading')} 
          actionButton={
            <Button variant="outline" asChild disabled>
                <Link href="/dashboard/empleados">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.empleados')})}
                </Link>
            </Button>
          }
        />
        <div className="max-w-2xl mx-auto mt-6">
            <Skeleton className="h-12 w-1/2 mb-4" /> 
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-1/3" />
            </div>
        </div>
      </>
    );
  }

  if (!empleado) {
    return (
      <PageHeader 
        title={t('common.error')} 
        description={t('employees.notFound')} 
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/empleados">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.empleados')})}
              </Link>
          </Button>
        }
      />
    );
  }

  const isEditingSelf = user?.id === empleado.id;
  const canEditRole = user?.role === 'admin' || (user?.role === 'moderator' && empleado.role === 'user' && !isEditingSelf) ;


  return (
    <>
      <PageHeader 
        title={t('employees.editTitle')}
        description={t('employees.editDescription', { name: empleado.nombre })}
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/empleados">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.empleados')})}
              </Link>
          </Button>
        }
      />
      <EmpleadoForm 
        onSubmit={handleSubmit} 
        defaultValues={empleado} 
        isSubmitting={isSubmitting}
        submitButtonText={t('employees.updateButton')}
        canEditRole={canEditRole}
        isEditingSelf={isEditingSelf}
      />
    </>
  );
}
