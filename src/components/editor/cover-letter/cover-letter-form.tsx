"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PROSE_FEATURES } from "@/lib/resume/schema-registry";
import { useResumeStore } from "@/lib/store";
import {
  applyCoverLetterValues,
  type CoverLetterFormValues,
  toCoverLetterValues,
} from "../editor-sections/resume-form-adapter";
import { RichTextEditor } from "../rich-text/rich-text-editor";

export function CoverLetterForm() {
  const open = useResumeStore((state) => state.open);
  const updateOpen = useResumeStore((state) => state.updateOpen);
  const t = useTranslations("editor.coverLetter");

  const form = useForm<CoverLetterFormValues>({
    defaultValues: open ? toCoverLetterValues(open) : undefined,
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      updateOpen((draft) => applyCoverLetterValues(draft, form.getValues()));
    });
    return () => subscription.unsubscribe();
  }, [form, updateOpen]);

  if (!open) return null;

  return (
    <form className="p-4">
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">{t("recipientHeading")}</FieldLegend>
          <FieldGroup className="mt-3">
            <Controller
              control={form.control}
              name="date"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{t("date")}</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder={t("datePlaceholder")}
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="recipientName"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {t("recipientName")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder={t("recipientNamePlaceholder")}
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="recipientTitle"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {t("recipientTitle")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder={t("recipientTitlePlaceholder")}
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="companyName"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {t("companyName")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder={t("companyNamePlaceholder")}
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="companyAddress"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {t("companyAddress")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder={t("companyAddressPlaceholder")}
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="mt-4">
          <FieldLegend variant="label">{t("title")}</FieldLegend>
          <FieldGroup className="mt-3">
            <Controller
              control={form.control}
              name="salutation"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {t("salutation")}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    placeholder={t("salutationPlaceholder")}
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="body"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {t("letterBody")}
                  </FieldLabel>
                  <RichTextEditor
                    id={field.name}
                    value={field.value}
                    features={PROSE_FEATURES}
                    placeholder="Write your cover letter here..."
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="signoff"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>{t("signoff")}</FieldLabel>
                    <Input
                      id={field.name}
                      placeholder={t("signoffPlaceholder")}
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="signatureName"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {t("signatureName")}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      placeholder={t("signatureNamePlaceholder")}
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}
