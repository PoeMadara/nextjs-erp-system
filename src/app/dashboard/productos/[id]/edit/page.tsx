"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProductoForm, type ProductoFormValues } from "@/components/crud/ProductoForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { getProductoById, updateProducto } from "@/lib/mockData";
import type { Producto } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";

export default function EditProductoPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      const fetchProducto = async () => {
        setIsLoading(true);
        try {
          const data = await getProductoById(id);
          if (data) {
            setProducto(data);
          } else {
            toast({ title: t('common.error'), description: t('products.notFound'), variant: "destructive" });
            router.push("/dashboard/productos");
          }
        } catch (error) {
          toast({ title: t('common.error'), description: t('products.failFetchDetails'), variant: "destructive" });
          router.push("/dashboard/productos");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProducto();
    } else {
      toast({ title: t('common.error'), description: t('products.invalidId'), variant: "destructive" });
      router.push("/dashboard/productos"); 
    }
  }, [id, router, toast, t]);

  const handleSubmit = async (values: ProductoFormValues) => {
    if (!producto || !user) {
       toast({ title: t('common.error'), description: !producto ? t('products.notFound') : "User not authenticated.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProducto(producto.id, values, user.id, t);
      toast({
        title: t('common.success'),
        description: t('products.successUpdate', { name: values.nombre }),
      });
      router.push("/dashboard/productos");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('products.failUpdate'),
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
          title={t('products.editTitle')} 
          description={t('common.loading')} 
          actionButton={
            <Button variant="outline" asChild disabled>
                <Link href="/dashboard/productos">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.productos')})}
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

  if (!producto) {
    return (
      <PageHeader 
        title={t('common.error')} 
        description={t('products.notFound')} 
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/productos">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.productos')})}
              </Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <PageHeader 
        title={t('products.editTitle')}
        description={t('products.editDescription', { name: producto.nombre })}
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/productos">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.productos')})}
              </Link>
          </Button>
        }
      />
      <ProductoForm 
        onSubmit={handleSubmit} 
        defaultValues={producto} 
        isSubmitting={isSubmitting}
        submitButtonText={t('products.updateButton')}
      />
    </>
  );
}
