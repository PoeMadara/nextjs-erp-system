
"use client";
import { ClienteForm, type ClienteFormValues } from "@/components/crud/ClienteForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { addCliente } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";

export default function NewClientePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ClienteFormValues) => {
    if (!user) {
      toast({ title: t('common.error'), description: "User not authenticated for this action.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const newCliente = await addCliente(values, user.id, t);
      toast({
        title: t('common.success'),
        description: t('clientes.successCreate', {name: newCliente.nombre }),
      });
      router.push("/dashboard/clientes");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('clientes.failCreate'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader 
        title={t('clientes.createTitle')}
        description={t('clientes.createDescription')}
        actionButton={
            <Button variant="outline" asChild>
                <Link href="/dashboard/clientes">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', { section: t('sidebar.clientes') })}
                </Link>
            </Button>
        }
      />
      <ClienteForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
        submitButtonText={t('clientes.createButton')} 
      />
    </>
  );
}
