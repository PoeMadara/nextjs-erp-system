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

export default function NewClientePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ClienteFormValues) => {
    setIsSubmitting(true);
    try {
      const newCliente = await addCliente(values);
      toast({
        title: "Success!",
        description: `Cliente ${newCliente.nombre} created successfully.`,
      });
      router.push("/dashboard/clientes");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create cliente. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Create New Cliente" 
        description="Fill in the form below to add a new customer."
        actionButton={
            <Button variant="outline" asChild>
                <Link href="/dashboard/clientes">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clientes
                </Link>
            </Button>
        }
      />
      <ClienteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitButtonText="Create Cliente" />
    </>
  );
}
