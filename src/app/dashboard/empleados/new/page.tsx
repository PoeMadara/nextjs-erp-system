
"use client";
import { EmpleadoForm, type EmpleadoFormValues } from "@/components/crud/EmpleadoForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { addEmpleado } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";

export default function NewEmpleadoPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: EmpleadoFormValues) => {
    if (!user) {
      toast({ title: t('common.error'), description: "User not authenticated for this action.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const newEmpleado = await addEmpleado(values, user.id, t);
      toast({
        title: t('common.success'),
        description: t('employees.successCreate', {name: newEmpleado.nombre }),
      });
      router.push("/dashboard/empleados");
    } catch (error) {
      let errorMessage = t('employees.failCreate');
      if (error instanceof Error) {
        errorMessage = error.message; 
      }
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader 
        title={t('employees.createTitle')}
        description={t('employees.createDescription')}
        actionButton={
            <Button variant="outline" asChild>
                <Link href="/dashboard/empleados">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', { section: t('sidebar.empleados') })}
                </Link>
            </Button>
        }
      />
      <EmpleadoForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
        submitButtonText={t('employees.createButton')} 
      />
    </>
  );
}

    