import type { CoverLetterPreview } from "../../cover-letter/cover-letter-preview";
import { ResumeRichText } from "../../resume-rich-text";
import { LuasaHeader } from "./luasa-header";

export function LuasaCoverLetter(props: CoverLetterPreview) {
  return (
    <div className="space-y-7">
      <LuasaHeader {...props.header} />

      <div className="space-y-4 resume-body-xs text-muted-foreground pt-2">
        {props.date && (
          <p className="font-medium tracking-wide uppercase text-muted-foreground">
            {props.date}
          </p>
        )}

        {(props.recipientName || props.companyName) && (
          <div className="space-y-0.5">
            {props.recipientName && (
              <p className="font-semibold text-foreground tracking-wide">
                {props.recipientName}
              </p>
            )}
            {props.recipientTitle && <p>{props.recipientTitle}</p>}
            {props.companyName && (
              <p className="font-medium text-foreground">{props.companyName}</p>
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
        className="space-y-3.5 resume-body-xs text-foreground leading-relaxed"
      />

      <div className="space-y-1 pt-4 resume-body-xs">
        {props.signoff && (
          <p className="text-muted-foreground">{props.signoff}</p>
        )}
        {props.signatureName && (
          <p className="font-medium tracking-wide text-foreground uppercase">
            {props.signatureName}
          </p>
        )}
      </div>
    </div>
  );
}
