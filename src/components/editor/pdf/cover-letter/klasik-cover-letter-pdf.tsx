import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { CoverLetterPreview } from "../../cover-letter/cover-letter-preview";
import { PdfContactIcon } from "../pdf-contact-icon";
import {
  type FontScales,
  fontScales,
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
      fontFamily: "Lora",
      fontSize: 9.5 * s.body,
      color: PDF_COLORS.foreground,
      lineHeight: 1.55,
    },
    header: { alignItems: "center" },
    name: { fontSize: 20 * s.name, lineHeight: 1.25 },
    headline: {
      marginTop: 1,
      fontSize: 10 * s.name,
      fontStyle: "italic",
      color: PDF_COLORS.muted,
    },
    contactRowWrap: {
      marginTop: 4,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 8,
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      fontSize: 9 * s.body,
      color: PDF_COLORS.muted,
    },
    linkMuted: { color: PDF_COLORS.muted, textDecoration: "underline" },
    recipientSection: {
      marginTop: 18,
      paddingTop: 14,
      borderTopWidth: 0.5,
      borderTopColor: PDF_COLORS.border,
      gap: 3,
    },
    dateText: {
      fontSize: 9.5 * s.body,
      marginBottom: 6,
    },
    recipientName: {
      fontSize: 10 * s.body,
      fontWeight: 700,
    },
    recipientTitle: {
      fontSize: 9.5 * s.body,
      color: PDF_COLORS.muted,
    },
    companyName: {
      fontSize: 9.5 * s.body,
      fontStyle: "italic",
    },
    companyAddress: {
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
      textAlign: "justify",
    },
    signoffSection: {
      marginTop: 24,
      gap: 4,
    },
    signoffText: {
      fontSize: 9.5 * s.body,
      fontStyle: "italic",
      color: PDF_COLORS.muted,
    },
    signatureName: {
      fontSize: 10 * s.body,
      fontWeight: 700,
    },
  });

export function KlasikCoverLetterPdf(props: { preview: CoverLetterPreview }) {
  const { preview } = props;
  const typography = pdfTypography(preview);
  const styles = makeStyles(fontScales(preview));

  return (
    <PdfStylesContext.Provider value={styles}>
      <Document>
        <Page
          size="A4"
          style={typography.page ? [styles.page, typography.page] : styles.page}
        >
          {/* Centered Header */}
          <View style={styles.header}>
            <PdfHeaderPhoto header={preview.header} centered />
            <Text style={styles.name}>{preview.header.fullName}</Text>
            {preview.header.headline ? (
              <Text style={styles.headline}>{preview.header.headline}</Text>
            ) : null}
            {preview.header.contacts.length > 0 ? (
              <View style={styles.contactRowWrap}>
                {preview.header.contacts.map((contact, index) => (
                  <View
                    key={`${contact.kind}-${index}`}
                    style={styles.contactRow}
                  >
                    {preview.header.showIcons ? (
                      <PdfContactIcon kind={contact.kind} />
                    ) : null}
                    {contact.href ? (
                      <Link src={contact.href} style={styles.linkMuted}>
                        {contact.value}
                      </Link>
                    ) : (
                      <Text>{contact.value}</Text>
                    )}
                  </View>
                ))}
              </View>
            ) : null}
          </View>

          {/* Recipient details */}
          <View style={styles.recipientSection}>
            {preview.date ? (
              <Text style={styles.dateText}>{preview.date}</Text>
            ) : null}

            {preview.recipientName ? (
              <Text style={styles.recipientName}>{preview.recipientName}</Text>
            ) : null}
            {preview.recipientTitle ? (
              <Text style={styles.recipientTitle}>
                {preview.recipientTitle}
              </Text>
            ) : null}
            {preview.companyName ? (
              <Text style={styles.companyName}>{preview.companyName}</Text>
            ) : null}
            {preview.companyAddress ? (
              <Text style={styles.companyAddress}>
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
              <Text style={styles.signatureName}>{preview.signatureName}</Text>
            ) : null}
          </View>
        </Page>
      </Document>
    </PdfStylesContext.Provider>
  );
}
