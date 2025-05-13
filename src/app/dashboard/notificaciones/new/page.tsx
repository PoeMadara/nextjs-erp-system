
"use client";
import { NotificationForm, type NotificationFormValues } from "@/components/crud/NotificationForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { addNotificationConfig } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";

export default function NewNotificationConfigPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: NotificationFormValues) => {
    if (!user) {
      toast({ title: t('common.error'), description: "User not authenticated for this action.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const configToCreate = {
        ...values,
        createdBy: user.id,
        isEnabled: true, // Default new configs to enabled
      };
      // Ensure recurringDays is undefined if frequency is 'once'
      if (configToCreate.frequency === 'once') {
        delete configToCreate.recurringDays;
      }
      
      await addNotificationConfig(configToCreate, user.id, t);
      toast({
        title: t('common.success'),
        description: t('notifications.successCreate', { title: values.title }),
      });
      router.push("/dashboard/notificaciones");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: (error instanceof Error) ? error.message : t('notifications.failCreate'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader 
        title={t('notifications.createTitle')}
        description={t('notifications.createDescription')}
        actionButton={
            <Button variant="outline" asChild>
                <Link href="/dashboard/notificaciones">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', { section: t('sidebar.notificaciones') })}
                </Link>
            </Button>
        }
      />
      <NotificationForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
        submitButtonText={t('notifications.createButton')} 
      />
    </>
  );
}
