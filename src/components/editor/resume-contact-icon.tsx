"use client";

import { ExternalLink, Globe, Mail, MapPin, Phone } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { ContactKind } from "./resume-preview";

const EASE = [0.22, 1, 0.36, 1] as const;

function LinkedinIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const CONTACT_ICON: Record<
  ContactKind,
  React.ComponentType<{ className?: string }>
> = {
  phone: Phone,
  email: Mail,
  website: Globe,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  link: ExternalLink,
  location: MapPin,
};

interface ResumeContactIconProps {
  kind: ContactKind;
  show: boolean;
  /** Which edge of the contact row the icon sits on. Defaults to "start". */
  edge?: "start" | "end";
  className?: string;
}

/**
 * Header contact glyph that grows in and collapses out as the document's
 * contact-icons toggle flips. The collapsed state also pulls back the row's
 * gap-2 with a negative margin, so the text closes up without a jump when
 * the element unmounts.
 */
export function ResumeContactIcon(props: ResumeContactIconProps) {
  const reduce = useReducedMotion();
  const Icon = CONTACT_ICON[props.kind];
  const collapsed =
    props.edge === "end"
      ? { width: 0, opacity: 0, marginLeft: "-0.5rem" }
      : { width: 0, opacity: 0, marginRight: "-0.5rem" };
  const expanded =
    props.edge === "end"
      ? { width: "0.875rem", opacity: 1, marginLeft: "0rem" }
      : { width: "0.875rem", opacity: 1, marginRight: "0rem" };

  return (
    <AnimatePresence initial={false} mode="wait">
      {props.show && (
        <motion.span
          key="icon"
          aria-hidden
          className={cn(
            "flex shrink-0 items-center overflow-hidden",
            props.className,
          )}
          initial={collapsed}
          animate={expanded}
          exit={collapsed}
          transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
        >
          <Icon className="size-3.5 shrink-0" />
        </motion.span>
      )}
    </AnimatePresence>
  );
}
