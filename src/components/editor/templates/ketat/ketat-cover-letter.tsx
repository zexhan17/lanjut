import type { CoverLetterPreview } from "../../cover-letter/cover-letter-preview";
import { ResumeRichText } from "../../resume-rich-text";
import { KetatHeader } from "./ketat-header";

export function KetatCoverLetter(props: CoverLetterPreview) {
  return (
    <div className="space-y-5 font-serif">
      <KetatHeader {...props.header} />

      <div className="space-y-3.5 resume-body-xs text-muted-foreground border-t border-border pt-3.5">
        {props.date && (
          <p className="font-semibold text-foreground italic">{props.date}</p>
        )}

        {(props.recipientName || props.companyName) && (
          <div className="space-y-0.5">
            {props.recipientName && (
              <p className="font-bold text-foreground">{props.recipientName}</p>
            )}
            {props.recipientTitle && (
              <p className="italic">{props.recipientTitle}</p>
            )}
            {props.companyName && (
              <p className="font-medium text-foreground">{props.companyName}</p>
            )}
            {props.companyAddress && <p>{props.companyAddress}</p>}
          </div>
        )}

        {props.salutation && (
          <p className="font-medium text-foreground pt-1.5">
            {props.salutation}
          </p>
        )}
      </div>

      <ResumeRichText
        blocks={props.body}
        className="space-y-3 resume-body-xs text-foreground font-serif leading-relaxed"
      />

      <div className="space-y-1 pt-3 resume-body-xs font-serif">
        {props.signoff && <p className="italic">{props.signoff}</p>}
        {props.signatureName && (
          <p className="font-bold text-foreground uppercase tracking-wide">
            {props.signatureName}
          </p>
        )}
      </div>
    </div>
  );
}
