
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AlmacenForm, type AlmacenFormValues } from "@/components/crud/AlmacenForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { getAlmacenById, updateAlmacen } from "@/lib/mockData";
import type { Almacen } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";

export default function EditAlmacenPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [almacen, setAlmacen] = useState<Almacen | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      const fetchAlmacen = async () => {
        setIsLoading(true);
        try {
          const data = await getAlmacenById(id);
          if (data) {
            setAlmacen(data);
          } else {
            toast({ title: t('common.error'), description: t('warehouse.notFound'), variant: "destructive" });
            router.push("/dashboard/almacen");
          }
        } catch (error) {
          toast({ title: t('common.error'), description: t('warehouse.failFetchDetails'), variant: "destructive" });
          router.push("/dashboard/almacen");
        } finally {
          setIsLoading(false);
        }
      };
      fetchAlmacen();
    } else {
      toast({ title: t('common.error'), description: t('warehouse.invalidId'), variant: "destructive" });
      router.push("/dashboard/almacen"); 
    }
  }, [id, router, toast, t]);

  const handleSubmit = async (values: AlmacenFormValues) => {
    if (!almacen || !user) {
       toast({ title: t('common.error'), description: !almacen ? t('warehouse.notFound') : "User not authenticated.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateAlmacen(almacen.id, values, user.id, t);
      toast({
        title: t('common.success'),
        description: t('warehouse.successUpdate', { name: values.nombre }),
      });
      router.push("/dashboard/almacen");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('warehouse.failUpdate'),
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
          title={t('warehouse.editTitle')} 
          description={t('common.loading')} 
          actionButton={
            <Button variant="outline" asChild disabled>
                <Link href="/dashboard/almacen">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.almacen')})}
                </Link>
            </Button>
          }
        />
        <div className="max-w-2xl mx-auto mt-6">
            <Skeleton className="h-12 w-1/2 mb-4" /> 
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              <Skeleton className="h-10 w-1/3" />
            </div>
        </div>
      </>
    );
  }

  if (!almacen) {
    return (
      <PageHeader 
        title={t('common.error')} 
        description={t('warehouse.notFound')} 
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/almacen">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.almacen')})}
              </Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PageHeader 
        title={t('warehouse.editTitle')}
        description={t('warehouse.editDescription', { name: almacen.nombre })}
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/almacen">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.almacen')})}
              </Link>
          </Button>
        }
      />
      <AlmacenForm 
        onSubmit={handleSubmit} 
        defaultValues={almacen} 
        isSubmitting={isSubmitting}
        submitButtonText={t('warehouse.updateButton')}
      />
    </>
  );
}
