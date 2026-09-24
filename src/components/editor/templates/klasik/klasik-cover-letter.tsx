import type { CoverLetterPreview } from "../../cover-letter/cover-letter-preview";
import { ResumeRichText } from "../../resume-rich-text";
import { KlasikHeader } from "./klasik-header";

export function KlasikCoverLetter(props: CoverLetterPreview) {
  return (
    <div className="space-y-6 font-serif">
      <KlasikHeader {...props.header} />

      <div className="space-y-3.5 resume-body-xs text-muted-foreground border-t border-border pt-4">
        {props.date && <p className="text-foreground">{props.date}</p>}

        {(props.recipientName || props.companyName) && (
          <div className="space-y-0.5">
            {props.recipientName && (
              <p className="font-semibold text-foreground">
                {props.recipientName}
              </p>
            )}
            {props.recipientTitle && <p>{props.recipientTitle}</p>}
            {props.companyName && (
              <p className="italic text-foreground">{props.companyName}</p>
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
        className="space-y-3.5 resume-body-xs text-foreground font-serif leading-relaxed text-justify"
      />

      <div className="space-y-1 pt-4 resume-body-xs font-serif">
        {props.signoff && <p className="italic">{props.signoff}</p>}
        {props.signatureName && (
          <p className="font-semibold text-foreground pt-1">
            {props.signatureName}
          </p>
        )}
      </div>
    </div>
  );
}
