import { ResumeHeaderContact } from "../../resume-header-contact";
import { ResumeHeaderPhoto } from "../../resume-header-photo";
import type { HeaderView } from "../../resume-preview";

export function KlasikHeader(props: HeaderView) {
  return (
    <header className="text-center font-serif">
      <ResumeHeaderPhoto header={props} className="mx-auto mb-2" />
      <h1 className="resume-name-2xl">{props.fullName}</h1>
      {props.headline && (
        <p className="mt-0.5 resume-name-sm italic text-muted-foreground">
          {props.headline}
        </p>
      )}
      {props.contacts.length > 0 && (
        <ul className="mt-1.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 resume-body-xs text-muted-foreground">
          {props.contacts.map((contact, index) => (
            <ResumeHeaderContact
              key={`${contact.kind}-${index}`}
              showIcons={props.showIcons}
              {...contact}
            />
          ))}
        </ul>
      )}
    </header>
  );
}
