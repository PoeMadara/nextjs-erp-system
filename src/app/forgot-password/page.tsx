"use client";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ErpLogo } from '@/components/icons/ErpLogo';
import { ArrowLeft } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from '@/hooks/useTranslation';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    console.log("Password reset requested for:", data.email);
    toast({
      title: t('forgotPasswordPage.resetToastTitle'),
      description: t('forgotPasswordPage.resetToastDescription', { email: data.email }),
    });
    form.reset();
  }

  return (
    <div className="flex items-center justify-center min-h-screen login-gradient-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <ErpLogo className="h-10" />
          </div>
          <CardTitle className="text-2xl font-bold">{t('forgotPasswordPage.title')}</CardTitle>
          <CardDescription>
            {t('forgotPasswordPage.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('forgotPasswordPage.sending') : t('forgotPasswordPage.sendResetLinkButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" asChild>
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('forgotPasswordPage.backToLogin')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
