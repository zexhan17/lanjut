import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

interface GithubInputProps {
  id?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const GITHUB_PREFIX = "github.com/";

/** Reduces a stored value or pasted URL down to the bare profile username. */
function toUsername(value: string): string {
  return value
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/^github\.com\//i, "")
    .replace(/^\/+/, "");
}

/**
 * GitHub field with a fixed `github.com/` prefix so the user only types their
 * username. The stored value keeps the full path (`github.com/<user>`) so the
 * preview restores `https://` like any other URL; an empty username stores an
 * empty string rather than a bare, linkless prefix.
 */
export function GithubInput(props: GithubInputProps) {
  const display = toUsername(props.value);
  return (
    // Tighten the gap between the prefix and the input (default is pl-1.5).
    <InputGroup className="has-[>[data-align=inline-start]]:[&>input]:pl-0">
      <InputGroupAddon className="pr-0">
        <InputGroupText>{GITHUB_PREFIX}</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        id={props.id}
        value={display}
        placeholder={props.placeholder}
        onChange={(event) => {
          const username = toUsername(event.target.value);
          props.onChange(username ? `${GITHUB_PREFIX}${username}` : "");
        }}
        onBlur={props.onBlur}
      />
    </InputGroup>
  );
}
