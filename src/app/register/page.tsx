"use client";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErpLogo } from '@/components/icons/ErpLogo';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState, useContext, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { LanguageContext, type Locale } from '@/contexts/LanguageContext';

const makeRegisterSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  name: z.string().min(2, { message: t('registerPage.nameMinLength', { count: 2 }) }),
  email: z.string().email({ message: t('registerPage.emailInvalid') }).min(1, {message: t('registerPage.emailRequired')}),
  password: z.string().min(6, { message: t('registerPage.passwordMinLength', { count: 6 }) }),
  confirmPassword: z.string().min(6, { message: t('registerPage.passwordMinLength', { count: 6 }) }),
  language: z.enum(['en', 'es'], { required_error: t('registerPage.languageRequired') })
}).refine((data) => data.password === data.confirmPassword, {
  message: t('registerPage.passwordsNoMatch'),
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<ReturnType<typeof makeRegisterSchema>>;

export default function RegisterPage() {
  const { register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t, language: currentContextLanguage, setLanguage: setContextLanguage } = useTranslation();
  const languageContext = useContext(LanguageContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(makeRegisterSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      language: currentContextLanguage,
    },
  });

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      // This effect runs when 't' changes (language changes), after the initial mount.
      // If there are any errors currently displayed, re-trigger validation to update their messages.
      if (Object.keys(form.formState.errors).length > 0) {
        form.trigger();
      }
    } else {
      isMounted.current = true;
    }
  }, [t, form.trigger, form.formState.errors]);


  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || (!isLoading && isAuthenticated)) {
    return ( 
      <div className="flex items-center justify-center min-h-screen login-gradient-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <div className="h-10 w-36 bg-gray-200 animate-pulse rounded-md mx-auto mb-4"></div>
            <div className="h-6 w-48 bg-gray-200 animate-pulse rounded-md mx-auto"></div>
            <div className="h-4 w-64 bg-gray-200 animate-pulse rounded-md mx-auto mt-2"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-10 bg-gray-200 animate-pulse rounded-md mt-2"></div>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <div className="h-4 w-40 bg-gray-200 animate-pulse rounded-md"></div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  async function onSubmit(data: RegisterFormValues) {
    const result = await register(data.name, data.email, data.password);
    if (result.success) {
      if (languageContext) {
        languageContext.setLanguage(data.language as Locale);
      }
      toast({
        title: t('registerPage.registrationSuccessTitle'),
        description: t('registerPage.registrationSuccessMessage'),
      });
      router.push('/login');
    } else {
      let errorMessage = result.message || t('registerPage.genericError');
      if (result.message?.toLowerCase().includes('email') || result.message?.toLowerCase().includes('correo')) {
           errorMessage = t('registerPage.emailExistsError');
           form.setError("email", { type: "manual", message: errorMessage });
      } else {
        toast({
            title: t('registerPage.registrationFailedTitle'),
            description: errorMessage,
            variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen login-gradient-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <ErpLogo className="h-10" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('registerPage.title')}</CardTitle>
          <CardDescription>{t('registerPage.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.nameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('common.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.password')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.confirmPassword')}</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('registerPage.languageLabel')}</FormLabel>
                    <Select onValueChange={(value) => {
                        field.onChange(value);
                        setContextLanguage(value as Locale); 
                      }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                           <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder={t('registerPage.selectLanguage')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">{t('registerPage.languageEnglish')}</SelectItem>
                        <SelectItem value="es">{t('registerPage.languageSpanish')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('registerPage.registering') : t('registerPage.registerButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="text-muted-foreground">
            {t('registerPage.haveAccount')}{' '}
            <Link href="/login" legacyBehavior>
              <a className="font-medium text-primary hover:underline">
                {t('registerPage.loginLink')}
              </a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
