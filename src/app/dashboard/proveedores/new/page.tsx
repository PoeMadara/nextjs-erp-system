"use client";
import { ProveedorForm, type ProveedorFormValues } from "@/components/crud/ProveedorForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { addProveedor } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function NewProveedorPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ProveedorFormValues) => {
    setIsSubmitting(true);
    try {
      const newProveedor = await addProveedor(values);
      toast({
        title: t('common.success'),
        description: t('suppliers.successCreate', {name: newProveedor.nombre }),
      });
      router.push("/dashboard/proveedores");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('suppliers.failCreate'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader 
        title={t('suppliers.createTitle')}
        description={t('suppliers.createDescription')}
        actionButton={
            <Button variant="outline" asChild>
                <Link href="/dashboard/proveedores">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', { section: t('sidebar.proveedores') })}
                </Link>
            </Button>
        }
      />
      <ProveedorForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
        submitButtonText={t('suppliers.createButton')} 
      />
    </>
  );
}
