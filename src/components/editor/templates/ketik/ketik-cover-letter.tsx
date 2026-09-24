import type { CoverLetterPreview } from "../../cover-letter/cover-letter-preview";
import { ResumeRichText } from "../../resume-rich-text";
import { KetikHeader } from "./ketik-header";

export function KetikCoverLetter(props: CoverLetterPreview) {
  return (
    <div className="space-y-6 font-mono">
      <KetikHeader {...props.header} />

      <div className="space-y-3 resume-body-xs text-muted-foreground border-t border-dashed border-border pt-4">
        {props.date && (
          <p className="text-foreground">{`// Date: ${props.date}`}</p>
        )}

        {(props.recipientName || props.companyName) && (
          <div className="space-y-0.5">
            {props.recipientName && (
              <p className="font-bold text-foreground">
                {`> To: ${props.recipientName}`}
              </p>
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
        className="space-y-3.5 resume-body-xs text-foreground font-mono leading-relaxed"
      />

      <div className="space-y-1 pt-4 resume-body-xs font-mono">
        {props.signoff && (
          <p className="text-muted-foreground">{props.signoff}</p>
        )}
        {props.signatureName && (
          <p className="font-bold text-foreground">{props.signatureName}</p>
        )}
      </div>
    </div>
  );
}
