"use client";
import { ProductoForm, type ProductoFormValues } from "@/components/crud/ProductoForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { addProducto } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";

export default function NewProductoPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ProductoFormValues) => {
    if (!user) {
      toast({ title: t('common.error'), description: "User not authenticated for this action.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const newProducto = await addProducto(values, user.id, t);
      toast({
        title: t('common.success'),
        description: t('products.successCreate', {name: newProducto.nombre }),
      });
      router.push("/dashboard/productos");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('products.failCreate'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader 
        title={t('products.createTitle')}
        description={t('products.createDescription')}
        actionButton={
            <Button variant="outline" asChild>
                <Link href="/dashboard/productos">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', { section: t('sidebar.productos') })}
                </Link>
            </Button>
        }
      />
      <ProductoForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
        submitButtonText={t('products.createButton')} 
      />
    </>
  );
}
