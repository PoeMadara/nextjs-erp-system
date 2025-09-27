
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { NotificationForm, type NotificationFormValues } from "@/components/crud/NotificationForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { getNotificationConfigById, updateNotificationConfig } from "@/lib/mockData";
import type { NotificationConfig } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";

export default function EditNotificationConfigPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [config, setConfig] = useState<NotificationConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      const fetchConfig = async () => {
        setIsLoading(true);
        try {
          const data = await getNotificationConfigById(id);
          if (data) {
            setConfig(data);
          } else {
            toast({ title: t('common.error'), description: t('notifications.configNotFound'), variant: "destructive" });
            router.push("/dashboard/notificaciones");
          }
        } catch (error) {
          toast({ title: t('common.error'), description: t('notifications.failFetchDetails'), variant: "destructive" });
          router.push("/dashboard/notificaciones");
        } finally {
          setIsLoading(false);
        }
      };
      fetchConfig();
    } else {
      toast({ title: t('common.error'), description: t('notifications.invalidId'), variant: "destructive" });
      router.push("/dashboard/notificaciones"); 
    }
  }, [id, router, toast, t]);

  const handleSubmit = async (values: NotificationFormValues) => {
    if (!config || !user) {
       toast({ title: t('common.error'), description: !config ? t('notifications.configNotFound') : "User not authenticated.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const updatesToSubmit = { ...values };
      if (updatesToSubmit.frequency === 'once') {
        delete updatesToSubmit.recurringDays;
      }
      // Retain isEnabled from original config if not part of form values explicitly
      // Or, if NotificationFormValues includes isEnabled, ensure it's passed through
      // For simplicity, assuming NotificationFormValues will contain all relevant fields including isEnabled
      // if it's meant to be editable via the form (it isn't currently).
      // If only toggled on list page, ensure it's not overwritten here unless intended.
      // Here, we are not directly editing `isEnabled` through this form, so it should be fine.

      await updateNotificationConfig(config.id, updatesToSubmit, user.id, t);
      toast({
        title: t('common.success'),
        description: t('notifications.successUpdate', { title: values.title }),
      });
      router.push("/dashboard/notificaciones");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: (error instanceof Error) ? error.message : t('notifications.failUpdate'),
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
          title={t('notifications.editTitle')} 
          description={t('common.loading')} 
          actionButton={
            <Button variant="outline" asChild disabled>
                <Link href="/dashboard/notificaciones">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.notificaciones')})}
                </Link>
            </Button>
          }
        />
        <div className="max-w-2xl mx-auto mt-6">
            <Skeleton className="h-12 w-1/2 mb-4" /> 
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              <Skeleton className="h-10 w-1/3" />
            </div>
        </div>
      </>
    );
  }

  if (!config) {
    return (
      <PageHeader 
        title={t('common.error')} 
        description={t('notifications.configNotFound')} 
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/notificaciones">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.notificaciones')})}
              </Link>
          </Button>
        }
      />
    );
  }
  
  const defaultFormValues: NotificationFormValues = {
    title: config.title,
    message: config.message,
    targetRoles: config.targetRoles,
    frequency: config.frequency,
    recurringDays: config.recurringDays,
    // isEnabled is managed separately, not part of this form's submission directly
  };


  return (
    <>
      <PageHeader 
        title={t('notifications.editTitle')}
        description={t('notifications.editDescription', { title: config.title })}
        actionButton={
          <Button variant="outline" asChild>
              <Link href="/dashboard/notificaciones">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('pageHeader.backTo', {section: t('sidebar.notificaciones')})}
              </Link>
          </Button>
        }
      />
      <NotificationForm 
        onSubmit={handleSubmit} 
        defaultValues={defaultFormValues} 
        isSubmitting={isSubmitting}
        submitButtonText={t('notifications.updateButton')}
        isEditMode={true}
      />
    </>
  );
}
