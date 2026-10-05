import { parseGridItemName } from "./resume-grid-item";
import type { LanguageItemView } from "./resume-preview";

export function ResumeLanguageItem(props: LanguageItemView) {
  const parsed = parseGridItemName(props.name);

  if (parsed.isCategorized) {
    return (
      <li className="flex items-baseline justify-between gap-4 resume-body-xs leading-relaxed">
        <div>
          <span className="font-semibold text-foreground">
            {parsed.category}:{" "}
          </span>
          <span className="font-normal text-muted-foreground">
            {parsed.details}
          </span>
        </div>
        {props.proficiency && (
          <span className="shrink-0 text-muted-foreground">
            {props.proficiency}
          </span>
        )}
      </li>
    );
  }

  return (
    <li className="flex items-baseline justify-between gap-4 resume-body-xs">
      <span className="font-semibold">{props.name}</span>
      {props.proficiency && (
        <span className="text-muted-foreground">{props.proficiency}</span>
      )}
    </li>
  );
}
