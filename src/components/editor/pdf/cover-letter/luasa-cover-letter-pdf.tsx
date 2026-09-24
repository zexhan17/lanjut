import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { CoverLetterPreview } from "../../cover-letter/cover-letter-preview";
import type { ContactView } from "../../resume-preview";
import {
  type FontScales,
  fontScales,
  NO_SCALE,
  PdfFontContext,
  PdfStylesContext,
  pdfTypography,
} from "../pdf-font";
import { PDF_COLORS } from "../pdf-fonts";
import { PdfHeaderPhoto } from "../pdf-header-photo";
import { PdfRichText } from "../pdf-rich-text";

const makeStyles = (s: FontScales) =>
  StyleSheet.create({
    page: {
      paddingVertical: 44,
      paddingHorizontal: 48,
      fontFamily: "Inter",
      fontSize: 9.5 * s.body,
      color: PDF_COLORS.foreground,
      lineHeight: 1.5,
    },
    accentBar: {
      borderLeftWidth: 1.5,
      borderLeftColor: PDF_COLORS.foreground,
      paddingLeft: 12,
    },
    softBar: {
      borderLeftWidth: 1.5,
      borderLeftColor: PDF_COLORS.border,
      paddingLeft: 12,
    },
    name: {
      fontFamily: "Lora",
      fontSize: 18 * s.name,
      textTransform: "uppercase",
      lineHeight: 1.25,
    },
    headline: {
      marginTop: 1,
      fontFamily: "Lora",
      fontSize: 10 * s.name,
      color: PDF_COLORS.muted,
    },
    contactLine: {
      marginTop: 3,
      fontSize: 9 * s.body,
      color: PDF_COLORS.muted,
    },
    linkMuted: { color: PDF_COLORS.muted, textDecoration: "underline" },
    recipientSection: {
      marginTop: 18,
      gap: 3,
    },
    dateText: {
      fontSize: 9 * s.body,
      textTransform: "uppercase",
      color: PDF_COLORS.muted,
      marginBottom: 6,
    },
    recipientName: {
      fontSize: 10 * s.body,
      fontWeight: 700,
    },
    recipientMeta: {
      fontSize: 9.5 * s.body,
      color: PDF_COLORS.muted,
    },
    salutationText: {
      fontSize: 9.5 * s.body,
      fontWeight: 600,
      marginTop: 8,
      marginBottom: 4,
    },
    bodySection: {
      marginTop: 14,
    },
    signoffSection: {
      marginTop: 24,
      gap: 4,
    },
    signoffText: {
      fontSize: 9.5 * s.body,
      color: PDF_COLORS.muted,
    },
    signatureName: {
      fontSize: 10 * s.body,
      fontWeight: 600,
      textTransform: "uppercase",
    },
  });

function LuasaContactLine(props: { contacts: ContactView[] }) {
  return (
    <Text style={{ marginTop: 3, fontSize: 9, color: PDF_COLORS.muted }}>
      {props.contacts.map((contact, index) => (
        <Text key={contact.kind}>
          {index > 0 ? " • " : ""}
          {contact.href ? (
            <Link
              src={contact.href}
              style={{ color: PDF_COLORS.muted, textDecoration: "underline" }}
            >
              {contact.value}
            </Link>
          ) : (
            contact.value
          )}
        </Text>
      ))}
    </Text>
  );
}

export function LuasaCoverLetterPdf(props: { preview: CoverLetterPreview }) {
  const { preview } = props;
  const typography = pdfTypography(preview);
  const styles = makeStyles(fontScales(preview));
  const serif = "Lora";

  return (
    <PdfFontContext.Provider value={typography.family}>
      <PdfStylesContext.Provider value={styles}>
        <Document>
          <Page
            size="A4"
            style={
              typography.page ? [styles.page, typography.page] : styles.page
            }
          >
            {/* Header with accent bar */}
            <View
              style={[
                styles.accentBar,
                { flexDirection: "row", alignItems: "flex-start", gap: 10 },
              ]}
            >
              <PdfHeaderPhoto header={preview.header} />
              <View>
                <Text style={[styles.name, { fontFamily: serif }]}>
                  {preview.header.fullName}
                </Text>
                {preview.header.headline ? (
                  <Text style={[styles.headline, { fontFamily: serif }]}>
                    {preview.header.headline}
                  </Text>
                ) : null}
                {preview.header.contacts.length > 0 ? (
                  <LuasaContactLine contacts={preview.header.contacts} />
                ) : null}
              </View>
            </View>

            {/* Recipient info with soft bar */}
            <View style={[styles.softBar, styles.recipientSection]}>
              {preview.date ? (
                <Text style={styles.dateText}>{preview.date}</Text>
              ) : null}

              {preview.recipientName ? (
                <Text style={styles.recipientName}>
                  {preview.recipientName}
                </Text>
              ) : null}
              {preview.recipientTitle ? (
                <Text style={styles.recipientMeta}>
                  {preview.recipientTitle}
                </Text>
              ) : null}
              {preview.companyName ? (
                <Text style={styles.recipientMeta}>{preview.companyName}</Text>
              ) : null}
              {preview.companyAddress ? (
                <Text style={styles.recipientMeta}>
                  {preview.companyAddress}
                </Text>
              ) : null}

              {preview.salutation ? (
                <Text style={styles.salutationText}>{preview.salutation}</Text>
              ) : null}
            </View>

            {/* Letter Body */}
            <View style={styles.bodySection}>
              <PdfRichText blocks={preview.body} />
            </View>

            {/* Sign-off */}
            <View style={styles.signoffSection} wrap={false}>
              {preview.signoff ? (
                <Text style={styles.signoffText}>{preview.signoff}</Text>
              ) : null}
              {preview.signatureName ? (
                <Text style={styles.signatureName}>
                  {preview.signatureName}
                </Text>
              ) : null}
            </View>
          </Page>
        </Document>
      </PdfStylesContext.Provider>
    </PdfFontContext.Provider>
  );
}
