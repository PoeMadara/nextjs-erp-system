
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { NotificationConfig, NotificationFrequency, NotificationTargetRole } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

const ALL_TARGET_ROLES: NotificationTargetRole[] = ['admin', 'moderator', 'user', 'all'];
const ALL_FREQUENCIES: NotificationFrequency[] = ['once', 'recurring'];

const makeNotificationSchema = (t: (key: string, params?: Record<string, string | number>) => string) => z.object({
  title: z.string().min(3, { message: t('notifications.validation.titleMinLength', {count: 3}) }),
  message: z.string().min(10, { message: t('notifications.validation.messageMinLength', {count: 10}) }),
  targetRoles: z.array(z.enum(ALL_TARGET_ROLES)).min(1, { message: t('notifications.validation.targetRolesRequired')}),
  frequency: z.enum(ALL_FREQUENCIES, { required_error: t('notifications.validation.frequencyRequired') }),
  recurringDays: z.coerce.number().optional(),
}).refine(data => {
  if (data.frequency === 'recurring' && (data.recurringDays === undefined || data.recurringDays <= 0)) {
    return false;
  }
  return true;
}, {
  message: t('notifications.validation.recurringDaysRequired'),
  path: ["recurringDays"],
});

export type NotificationFormValues = z.infer<ReturnType<typeof makeNotificationSchema>>;

interface NotificationFormProps {
  onSubmit: (values: NotificationFormValues) => Promise<void>;
  defaultValues?: Partial<NotificationFormValues>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  isEditMode?: boolean;
}

export function NotificationForm({ 
  onSubmit, 
  defaultValues, 
  isSubmitting = false, 
  submitButtonText,
  isEditMode = false
}: NotificationFormProps) {
  const { t } = useTranslation();
  const notificationSchema = makeNotificationSchema(t);
  
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      message: defaultValues?.message || "",
      targetRoles: defaultValues?.targetRoles || [],
      frequency: defaultValues?.frequency || 'once',
      recurringDays: defaultValues?.recurringDays === undefined ? undefined : Number(defaultValues.recurringDays),
    },
  });

  const watchedFrequency = form.watch("frequency");

  const actualSubmitButtonText = submitButtonText || (isEditMode ? t('notifications.updateButton') : t('notifications.createButton'));

  return (
    <Card className="max-w-2xl mx-auto shadow-lg mt-6">
      <CardHeader>
        <CardTitle>{isEditMode ? t('notifications.editFormTitle') : t('notifications.createFormTitle')}</CardTitle>
        <CardDescription>{t('notifications.formDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('notifications.form.titleLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('notifications.form.titlePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('notifications.form.messageLabel')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('notifications.form.messagePlaceholder')} {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="targetRoles"
              render={() => (
                <FormItem>
                  <FormLabel>{t('notifications.form.targetAudienceLabel')}</FormLabel>
                  <FormDescription>{t('notifications.form.targetAudienceDescription')}</FormDescription>
                  <div className="flex flex-wrap gap-x-6 gap-y-4 pt-2">
                  {ALL_TARGET_ROLES.map((role) => (
                    <FormField
                      key={role}
                      control={form.control}
                      name="targetRoles"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={role}
                            className="flex flex-row items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(role)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), role])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value) => value !== role
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t(`notifications.targetRole.${role}`)}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t('notifications.form.frequencyLabel')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="once" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('notifications.frequencyOnce')}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="recurring" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('notifications.frequencyRecurringLabel')}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedFrequency === 'recurring' && (
              <FormField
                control={form.control}
                name="recurringDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('notifications.form.recurringDaysLabel')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder={t('notifications.form.recurringDaysPlaceholder')} 
                        {...field}
                        value={field.value === undefined ? '' : String(field.value)} // Handle undefined for empty input
                        onChange={event => {
                          const value = event.target.value;
                          field.onChange(value === '' ? undefined : Number(value)); // Convert to number or undefined
                        }}
                      />
                    </FormControl>
                     <FormDescription>{t('notifications.form.recurringDaysDescription')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? t('common.saving') : actualSubmitButtonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
