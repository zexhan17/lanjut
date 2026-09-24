import { ResumeHeader } from "../resume-header";
import { ResumeRichText } from "../resume-rich-text";
import type { CoverLetterPreview } from "./cover-letter-preview";

export function AwalCoverLetter(props: CoverLetterPreview) {
  return (
    <div className="space-y-6">
      <ResumeHeader {...props.header} />

      <div className="space-y-4 resume-body-xs text-muted-foreground border-t pt-4">
        {props.date && (
          <p className="font-medium text-foreground">{props.date}</p>
        )}

        {(props.recipientName || props.companyName) && (
          <div className="space-y-0.5">
            {props.recipientName && (
              <p className="font-semibold text-foreground">
                {props.recipientName}
              </p>
            )}
            {props.recipientTitle && <p>{props.recipientTitle}</p>}
            {props.companyName && (
              <p className="font-medium">{props.companyName}</p>
            )}
            {props.companyAddress && <p>{props.companyAddress}</p>}
          </div>
        )}

        {props.salutation && (
          <p className="font-medium text-foreground pt-2">{props.salutation}</p>
        )}
      </div>

      <ResumeRichText
        blocks={props.body}
        className="space-y-3 resume-body-sm text-foreground leading-relaxed"
      />

      <div className="space-y-1 pt-4 resume-body-xs">
        {props.signoff && (
          <p className="text-muted-foreground">{props.signoff}</p>
        )}
        {props.signatureName && (
          <p className="font-semibold text-foreground">{props.signatureName}</p>
        )}
      </div>
    </div>
  );
}
