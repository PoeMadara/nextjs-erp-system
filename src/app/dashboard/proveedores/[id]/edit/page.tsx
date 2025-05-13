"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProveedorForm, type ProveedorFormValues } from "@/components/crud/ProveedorForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { getProveedorById, updateProveedor } from "@/lib/mockData";
import type { Proveedor } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";

export default function EditProveedorPage() {
  const { router } = useRouter();
  const { params } = useParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      const fetchProveedor = async () => {
        setIsLoading(true);
        try {
          const data = await getProveedorById(id);
          if (data) {
            setProveedor(data);
          } else {
            toast({ title: t('common.error'), description: t('suppliers.notFound'), variant: "destructive" });
            router.push("/dashboard/proveedores");
          }
        } catch (error) {
          toast({ title: t('common.error'), description: t('suppliers.failFetchDetails'), variant: "destructive" });
          router.push("/dashboard/proveedores");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProveedor();
    } else {
      toast({ title: t('common.error'), description: t('suppliers.invalidId'), variant: "destructive" });
      router.push("/dashboard/proveedores"); 
    }
  }, [id, router, toast, t]);

  const handleSubmit = async (values: ProveedorFormValues) => {
    if (!proveedor || !user) {
       toast({ title: t('common.error'), description: !proveedor ? t('suppliers.notFound') : "User not authenticated.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProveedor(proveedor.id, values, user.id, t);
      toast({
        title: t('common.success'),
        description: t('suppliers.successUpdate', { name: values.nombre }),
      });
      router.push("/dashboard/proveedores");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('suppliers.failUpdate'),
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
          title={t('suppliers.editTitle')} 
          description={t('common.loading')} 
          actionButton={
            <Button variant="outline" asChild disabled>
                <Link href="/dashboard/proveedores">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.proveedores')})}
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

  if (!proveedor) {
    return (
      <PageHeader 
        title={t('common.error')} 
        description={t('suppliers.notFound')} 
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/proveedores">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.proveedores')})}
              </Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PageHeader 
        title={t('suppliers.editTitle')}
        description={t('suppliers.editDescription', { name: proveedor.nombre })}
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/proveedores">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.proveedores')})}
              </Link>
          </Button>
        }
      />
      <ProveedorForm 
        onSubmit={handleSubmit} 
        defaultValues={proveedor} 
        isSubmitting={isSubmitting}
        submitButtonText={t('suppliers.updateButton')}
      />
    </>
  );
}
