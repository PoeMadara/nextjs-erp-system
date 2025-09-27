
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { getEmpleadoById, updateEmpleado } from "@/lib/mockData";
import type { Empleado } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const makeProfileSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  bio: z.string().max(350, { message: t('profilePage.bioMaxLengthError') }).optional(),
});

type ProfileFormValues = z.infer<ReturnType<typeof makeProfileSchema>>;

export default function ProfilePage() {
  const { user, updateUserInContext } = useAuth();
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [employeeDetails, setEmployeeDetails] = useState<Empleado | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const profileSchema = makeProfileSchema(t);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
    },
  });

  useEffect(() => {
    if (user?.id) {
      const fetchDetails = async () => {
        setIsLoading(true);
        try {
          const details = await getEmpleadoById(user.id);
          if (details) {
            setEmployeeDetails(details);
            form.reset({ bio: details.bio || "" });
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
  }, [user?.id, toast, t, form]);

  const getInitials = (name: string) => {
    if (!name) return "??";
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  const onSubmitBio = async (data: ProfileFormValues) => {
    if (!user || !employeeDetails) return;
    try {
      const updatedEmployee = await updateEmpleado(employeeDetails.id, { bio: data.bio }, user.id, t);
      if (updatedEmployee) {
        setEmployeeDetails(updatedEmployee);
        updateUserInContext({ name: updatedEmployee.nombre }); // Keep context name updated if needed, though bio isn't there.
        toast({ title: t('common.success'), description: t('profilePage.bioUpdateSuccess') });
      } else {
        toast({ title: t('common.error'), description: t('profilePage.bioUpdateError'), variant: "destructive" });
      }
    } catch (error) {
      toast({ title: t('common.error'), description: t('profilePage.bioUpdateError'), variant: "destructive" });
    }
  };

  const handleAvatarClick = () => {
    toast({ title: t('common.underConstruction'), description: t('profilePage.profilePicUpdateSoon') });
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title={t('profilePage.loadingProfile')} />
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="items-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-6 w-1/2 mt-4" />
            <Skeleton className="h-4 w-1/3 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div><Skeleton className="h-4 w-1/4 mb-1" /><Skeleton className="h-6 w-3/4" /></div>
            <div><Skeleton className="h-4 w-1/4 mb-1" /><Skeleton className="h-6 w-3/4" /></div>
            <div><Skeleton className="h-4 w-1/4 mb-1" /><Skeleton className="h-16 w-full" /></div>
            <Skeleton className="h-10 w-24" />
          </CardContent>
        </Card>
      </>
    );
  }

  if (!user || !employeeDetails) {
    return <PageHeader title={t('common.error')} description={t('employees.notFound')} />;
  }
  
  const dateLocale = language === 'es' ? es : enUS;

  return (
    <>
      <PageHeader title={t('profilePage.title')} description={t('profilePage.description')} />
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="items-center text-center">
          <Button variant="ghost" className="rounded-full h-24 w-24 p-0" onClick={handleAvatarClick} aria-label={t('profilePage.editProfilePic')}>
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src={`https://picsum.photos/seed/${employeeDetails.email}/100/100`} alt={employeeDetails.nombre} data-ai-hint="person user" />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {getInitials(employeeDetails.nombre)}
              </AvatarFallback>
            </Avatar>
          </Button>
          <CardTitle className="mt-4 text-2xl">{employeeDetails.nombre}</CardTitle>
          <CardDescription>{employeeDetails.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="role">{t('profilePage.roleLabel')}</Label>
            <p id="role" className="text-sm text-muted-foreground p-2 border rounded-md bg-muted">
              {t(`employees.role${employeeDetails.role.charAt(0).toUpperCase() + employeeDetails.role.slice(1)}`)}
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitBio)} className="space-y-4">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="bio">{t('profilePage.bioLabel')}</Label>
                    <FormControl>
                      <Textarea
                        id="bio"
                        placeholder={t('profilePage.bioPlaceholder')}
                        maxLength={350}
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                {form.formState.isSubmitting ? t('common.saving') : t('profilePage.saveBioButton')}
              </Button>
            </form>
          </Form>

          <div>
            <Label htmlFor="last-access">{t('profilePage.lastAccessLabel')}</Label>
             <p id="last-access" className="text-sm text-muted-foreground p-2 border rounded-md bg-muted">
              {employeeDetails.lastLogin ? format(new Date(employeeDetails.lastLogin), 'PPPpp', { locale: dateLocale }) : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
