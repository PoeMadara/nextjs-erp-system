
"use client";
import { AlmacenForm, type AlmacenFormValues } from "@/components/crud/AlmacenForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { addAlmacen } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";

export default function NewAlmacenPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: AlmacenFormValues) => {
    if (!user) {
      toast({ title: t('common.error'), description: "User not authenticated for this action.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const newAlmacen = await addAlmacen(values, user.id, t);
      toast({
        title: t('common.success'),
        description: t('warehouse.successCreate', { name: newAlmacen.nombre }),
      });
      router.push("/dashboard/almacen");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('warehouse.failCreate'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader 
        title={t('warehouse.createTitle')}
        description={t('warehouse.createDescription')}
        actionButton={
            <Button variant="outline" asChild>
                <Link href="/dashboard/almacen">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', { section: t('sidebar.almacen') })}
                </Link>
            </Button>
        }
      />
      <AlmacenForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
        submitButtonText={t('warehouse.createButton')} 
      />
    </>
  );
}
