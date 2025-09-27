
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { getEmpleadoById, updateEmpleado } from "@/lib/mockData";
import type { Empleado } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Eye, EyeOff } from "lucide-react";

const makeEmailSchema = (t: (key: string) => string) => z.object({
  email: z.string().email({ message: t('registerPage.emailInvalid') }),
});

const makePasswordSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  currentPassword: z.string().min(1, { message: t('settingsPage.currentPasswordLabel') + " " + t('common.error')}),
  newPassword: z.string().min(6, { message: t('settingsPage.passwordMinLength', { count: 6 }) }),
  confirmNewPassword: z.string().min(6, { message: t('settingsPage.passwordMinLength', { count: 6 }) }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: t('settingsPage.passwordsDoNotMatch'),
  path: ["confirmNewPassword"],
});

type EmailFormValues = z.infer<ReturnType<typeof makeEmailSchema>>;
type PasswordFormValues = z.infer<ReturnType<typeof makePasswordSchema>>;

export default function SettingsPage() {
  const { user, updateUserInContext } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [employeeDetails, setEmployeeDetails] = useState<Empleado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const emailSchema = makeEmailSchema(t);
  const passwordSchema = makePasswordSchema(t);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const [emailNotifications, setEmailNotifications] = useState(true); // Default to true


  useEffect(() => {
    if (user?.id) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const details = await getEmpleadoById(user.id);
          if (details) {
            setEmployeeDetails(details);
            emailForm.reset({ email: details.email });
            setEmailNotifications(details.emailNotifications ?? true); // Ensure it's boolean
          } else {
            toast({ title: t('common.error'), description: t('employees.notFound'), variant: "destructive" });
          }
        } catch (error) {
          toast({ title: t('common.error'), description: t('employees.failFetchDetails'), variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [user?.id, toast, t, emailForm]);
  
  const onSubmitEmail = async (data: EmailFormValues) => {
    if (!user || !employeeDetails) return;
    try {
      const updatedEmployee = await updateEmpleado(employeeDetails.id, { email: data.email }, user.id, t);
      if (updatedEmployee) {
        setEmployeeDetails(updatedEmployee);
        updateUserInContext({ email: updatedEmployee.email });
        toast({ title: t('common.success'), description: t('settingsPage.emailUpdateSuccess') });
      } else {
        toast({ title: t('common.error'), description: t('settingsPage.emailUpdateError'), variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t('common.error'), description: t('settingsPage.emailUpdateError'), variant: "destructive" });
    }
  };

  const onSubmitPassword = async (data: PasswordFormValues) => {
    if (!user || !employeeDetails) return;
    if (employeeDetails.password !== data.currentPassword) {
        passwordForm.setError("currentPassword", { type: "manual", message: t('settingsPage.passwordUpdateError') });
        return;
    }
    try {
      const updatedEmployee = await updateEmpleado(employeeDetails.id, { password: data.newPassword }, user.id, t);
       if (updatedEmployee) {
        setEmployeeDetails(updatedEmployee); 
        passwordForm.reset();
        toast({ title: t('common.success'), description: t('settingsPage.passwordUpdateSuccess') });
      } else {
        toast({ title: t('common.error'), description: t('settingsPage.passwordUpdateError'), variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t('common.error'), description: t('settingsPage.passwordUpdateError'), variant: "destructive" });
    }
  };

  const handleNotificationToggle = async (checked: boolean) => {
    if (!user || !employeeDetails) return;
    setEmailNotifications(checked); // Optimistically update UI
    try {
        const updatedEmployee = await updateEmpleado(employeeDetails.id, { emailNotifications: checked }, user.id, t);
        if (updatedEmployee) {
            setEmployeeDetails(updatedEmployee);
            // No need to update user in context as emailNotifications is not part of the minimal User interface in AuthContext
            toast({ title: t('common.success'), description: t('settingsPage.notificationSettingsUpdateSuccess') });
        } else {
            toast({ title: t('common.error'), description: t('settingsPage.notificationSettingsUpdateError'), variant: "destructive" });
            setEmailNotifications(!checked); // Revert on error
        }
    } catch (error) {
        toast({ title: t('common.error'), description: t('settingsPage.notificationSettingsUpdateError'), variant: "destructive" });
        setEmailNotifications(!checked); // Revert on error
    }
  };


  if (isLoading) {
    return (
      <>
        <PageHeader title={t('settingsPage.loadingSettings')} />
        <div className="space-y-6 max-w-2xl mx-auto">
          <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-24 mt-2" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
        </div>
      </>
    );
  }

  if (!user || !employeeDetails) {
    return <PageHeader title={t('common.error')} description={t('employees.notFound')} />;
  }

  return (
    <>
      <PageHeader title={t('settingsPage.title')} description={t('settingsPage.description')} />
      <div className="space-y-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{t('settingsPage.accountSectionTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">{t('settingsPage.emailLabel')}</Label>
                      <FormControl>
                        <Input id="email" type="email" placeholder={t('settingsPage.emailPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={emailForm.formState.isSubmitting || !emailForm.formState.isDirty}>
                  {emailForm.formState.isSubmitting ? t('common.saving') : t('settingsPage.saveEmailButton')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settingsPage.securitySectionTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>{t('settingsPage.changePasswordLabel')}</AccordionTrigger>
                <AccordionContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4 pt-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="currentPassword">{t('settingsPage.currentPasswordLabel')}</Label>
                             <FormControl>
                              <div className="relative">
                                <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} placeholder={t('settingsPage.currentPasswordPlaceholder')} {...field} />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                  {showCurrentPassword ? <EyeOff /> : <Eye />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="newPassword">{t('settingsPage.newPasswordLabel')}</Label>
                            <FormControl>
                               <div className="relative">
                                <Input id="newPassword" type={showNewPassword ? "text" : "password"} placeholder={t('settingsPage.newPasswordPlaceholder')} {...field} />
                                 <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground" onClick={() => setShowNewPassword(!showNewPassword)}>
                                  {showNewPassword ? <EyeOff /> : <Eye />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                          <FormItem>
                            <Label htmlFor="confirmNewPassword">{t('settingsPage.confirmNewPasswordLabel')}</Label>
                            <FormControl>
                              <div className="relative">
                                <Input id="confirmNewPassword" type={showConfirmNewPassword ? "text" : "password"} placeholder={t('settingsPage.confirmNewPasswordPlaceholder')} {...field} />
                                 <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                                  {showConfirmNewPassword ? <EyeOff /> : <Eye />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                        {passwordForm.formState.isSubmitting ? t('common.saving') : t('settingsPage.savePasswordButton')}
                      </Button>
                    </form>
                  </Form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settingsPage.notificationsSectionTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>{t('settingsPage.emailNotificationsLabel')}</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                  {t('settingsPage.emailNotificationsDescription')}
                </span>
              </Label>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={handleNotificationToggle}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
