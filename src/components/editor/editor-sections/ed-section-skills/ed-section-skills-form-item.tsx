import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { type Control, Controller } from "react-hook-form";
import { SortableItem } from "@/components/shared/sortable-list";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { SkillsFormValues } from "../resume-form-adapter";

interface EditorSectionSkillsFormItemProps {
  id: string;
  index: number;
  control: Control<SkillsFormValues>;
  onRemoveField: (index: number) => void;
}

export function EditorSectionSkillsFormItem(
  props: EditorSectionSkillsFormItemProps,
) {
  const t = useTranslations("editor.skills");

  return (
    <SortableItem
      id={props.id}
      handleLabel={t("reorder")}
      align="start"
      handleClassName="mt-2"
    >
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Controller
            control={props.control}
            name={`skills.${props.index}.category`}
            render={({ field, fieldState }) => (
              <Field className="flex-1">
                <Input
                  placeholder={t("categoryPlaceholder")}
                  aria-label={t("category")}
                  {...field}
                  id={field.name}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => props.onRemoveField(props.index)}
          >
            <Trash className="size-3.5 stroke-destructive" />
            <span className="sr-only">{t("remove")}</span>
          </Button>
        </div>

        <Controller
          control={props.control}
          name={`skills.${props.index}.skills`}
          render={({ field, fieldState }) => (
            <Field className="flex-1">
              <Input
                placeholder={t("skillsPlaceholder")}
                aria-label={t("skills")}
                {...field}
                id={field.name}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>
    </SortableItem>
  );
}
