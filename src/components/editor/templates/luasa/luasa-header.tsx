import { ResumeHeaderContact } from "../../resume-header-contact";
import { ResumeHeaderPhoto } from "../../resume-header-photo";
import type { HeaderView } from "../../resume-preview";

export function LuasaHeader(props: HeaderView) {
  return (
    <header className="flex items-start gap-4 border-l-2 border-foreground/80 pl-4">
      <ResumeHeaderPhoto header={props} />
      <div>
        <h1 className="font-serif resume-name-2xl uppercase tracking-[0.08em]">
          {props.fullName}
        </h1>
        {props.headline && (
          <p className="mt-0.5 font-serif resume-name-sm text-muted-foreground">
            {props.headline}
          </p>
        )}
        {props.contacts.length > 0 && (
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 resume-body-xs text-muted-foreground">
            {props.contacts.map((contact, index) => (
              <ResumeHeaderContact
                key={`${contact.kind}-${index}`}
                showIcons={props.showIcons}
                {...contact}
              />
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
