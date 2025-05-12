"use client";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ErpLogo } from '@/components/icons/ErpLogo';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Password validation remains, though mock doesn't verify string
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

 useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);


  if (isLoading || (!isLoading && isAuthenticated)) {
     return ( // Basic loading skeleton for login page
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
            <div className="h-10 bg-gray-200 animate-pulse rounded-md mt-2"></div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <div className="h-4 w-40 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-4 w-52 bg-gray-200 animate-pulse rounded-md"></div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  async function onSubmit(data: LoginFormValues) {
    form.clearErrors(); // Clear previous errors
    
    // Always call the login function from AuthContext.
    // The AuthContext's login function will handle finding the user (admin or otherwise)
    // and performing the actual login steps including redirection.
    const result = await login(data.email, data.password); // Pass password, AuthContext can choose to use it or not for mock

    if (!result.success) {
      form.setError("email", { type: "manual", message: result.message || "Login failed. Please check your credentials." });
      // Optionally, set a generic error on the password field too, or just on email.
      form.setError("password", { type: "manual", message: " " }); // Invisible message to show error state
    }
    // Successful login and navigation to /dashboard is handled within AuthContext's login function.
  }

  return (
    <div className="flex items-center justify-center min-h-screen login-gradient-background p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <ErpLogo className="h-10" />
          </div>
          <CardTitle className="text-2xl font-bold">ERP Login</CardTitle>
          <CardDescription>Enter your credentials to access the ERP system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="usuario@example.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
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
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Link href="/forgot-password" legacyBehavior>
                  <a className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isLoading}>
                {form.formState.isSubmitting || isLoading ? "Logging in..." : "Iniciar sesión"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-center text-sm text-muted-foreground space-y-2">
          <p>
            Don't have an account?{' '}
            <Link href="/register" legacyBehavior>
              <a className="font-medium text-primary hover:underline">
                Register
              </a>
            </Link>
          </p>
          <p>Contact support if you have issues logging in.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
