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
  NO_SCALE,
  PdfFontContext,
  PdfStylesContext,
  pdfTypography,
  usePdfFontFamily,
} from "../pdf-font";
import { PDF_COLORS } from "../pdf-fonts";
import { PdfHeaderPhoto } from "../pdf-header-photo";
import { PdfRichText } from "../pdf-rich-text";

const makeStyles = (s: FontScales) =>
  StyleSheet.create({
    page: {
      paddingVertical: 40,
      paddingHorizontal: 44,
      fontFamily: "Lora",
      fontSize: 9.5 * s.body,
      color: PDF_COLORS.foreground,
      lineHeight: 1.5,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 24,
    },
    headerLeft: { flexShrink: 1 },
    name: {
      fontFamily: "Lora",
      fontSize: 19 * s.name,
      textTransform: "uppercase",
      lineHeight: 1.25,
    },
    headline: {
      marginTop: 2,
      fontFamily: "Lora",
      fontSize: 11 * s.name,
      color: PDF_COLORS.muted,
    },
    headerRight: { alignItems: "flex-end", gap: 4 },
    contactRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    linkPlain: { color: PDF_COLORS.foreground, textDecoration: "underline" },
    recipientSection: {
      marginTop: 18,
      paddingTop: 14,
      borderTopWidth: 0.75,
      borderTopColor: PDF_COLORS.border,
      gap: 3,
    },
    dateText: {
      fontSize: 9.5 * s.body,
      fontStyle: "italic",
      marginBottom: 6,
    },
    recipientName: {
      fontSize: 10 * s.body,
      fontWeight: 700,
    },
    recipientTitle: {
      fontSize: 9.5 * s.body,
      fontStyle: "italic",
      color: PDF_COLORS.muted,
    },
    companyMeta: {
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
      marginTop: 12,
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
      textTransform: "uppercase",
    },
  });

export function KetatCoverLetterPdf(props: { preview: CoverLetterPreview }) {
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
            {/* Header */}
            <View style={styles.header}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <PdfHeaderPhoto header={preview.header} />
                <View style={styles.headerLeft}>
                  <Text style={[styles.name, { fontFamily: serif }]}>
                    {preview.header.fullName}
                  </Text>
                  {preview.header.headline ? (
                    <Text style={[styles.headline, { fontFamily: serif }]}>
                      {preview.header.headline}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.headerRight}>
                {preview.header.contacts.map((contact, index) => (
                  <View
                    key={`${contact.kind}-${index}`}
                    style={styles.contactRow}
                  >
                    {contact.href ? (
                      <Link src={contact.href} style={styles.linkPlain}>
                        {contact.value}
                      </Link>
                    ) : (
                      <Text>{contact.value}</Text>
                    )}
                    {preview.header.showIcons ? (
                      <PdfContactIcon kind={contact.kind} />
                    ) : null}
                  </View>
                ))}
              </View>
            </View>

            {/* Recipient details & Date */}
            <View style={styles.recipientSection}>
              {preview.date ? (
                <Text style={styles.dateText}>{preview.date}</Text>
              ) : null}

              {preview.recipientName ? (
                <Text style={styles.recipientName}>
                  {preview.recipientName}
                </Text>
              ) : null}
              {preview.recipientTitle ? (
                <Text style={styles.recipientTitle}>
                  {preview.recipientTitle}
                </Text>
              ) : null}
              {preview.companyName ? (
                <Text style={styles.companyMeta}>{preview.companyName}</Text>
              ) : null}
              {preview.companyAddress ? (
                <Text style={styles.companyMeta}>{preview.companyAddress}</Text>
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
