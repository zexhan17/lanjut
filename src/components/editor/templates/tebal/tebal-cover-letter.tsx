import type { CoverLetterPreview } from "../../cover-letter/cover-letter-preview";
import { ResumeRichText } from "../../resume-rich-text";
import { TebalHeader } from "./tebal-header";

export function TebalCoverLetter(props: CoverLetterPreview) {
  return (
    <div className="space-y-6">
      <TebalHeader {...props.header} />

      <div className="space-y-3.5 resume-body-xs text-muted-foreground border-t-2 border-foreground pt-3.5">
        {props.date && (
          <p className="font-bold text-foreground">{props.date}</p>
        )}

        {(props.recipientName || props.companyName) && (
          <div className="space-y-0.5">
            {props.recipientName && (
              <p className="font-bold text-foreground">{props.recipientName}</p>
            )}
            {props.recipientTitle && <p>{props.recipientTitle}</p>}
            {props.companyName && (
              <p className="font-semibold text-foreground">
                {props.companyName}
              </p>
            )}
            {props.companyAddress && <p>{props.companyAddress}</p>}
          </div>
        )}

        {props.salutation && (
          <p className="font-bold text-foreground pt-2">{props.salutation}</p>
        )}
      </div>

      <ResumeRichText
        blocks={props.body}
        className="space-y-3 resume-body-sm text-foreground leading-relaxed font-normal"
      />

      <div className="space-y-1 pt-4 resume-body-xs">
        {props.signoff && (
          <p className="text-muted-foreground font-medium">{props.signoff}</p>
        )}
        {props.signatureName && (
          <p className="font-bold text-foreground uppercase tracking-wide">
            {props.signatureName}
          </p>
        )}
      </div>
    </div>
  );
}
