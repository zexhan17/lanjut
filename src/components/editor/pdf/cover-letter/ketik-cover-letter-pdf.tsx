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
      paddingVertical: 40,
      paddingHorizontal: 44,
      fontFamily: "Inter",
      fontSize: 9 * s.body,
      color: PDF_COLORS.foreground,
      lineHeight: 1.5,
    },
    name: {
      fontFamily: "GeistMono",
      fontSize: 16 * s.name,
      fontWeight: 700,
      lineHeight: 1.25,
    },
    headline: {
      marginTop: 2,
      fontFamily: "GeistMono",
      fontSize: 10 * s.name,
      color: PDF_COLORS.muted,
    },
    contactRowWrap: {
      marginTop: 4,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      fontFamily: "GeistMono",
      fontSize: 8.5 * s.body,
      color: PDF_COLORS.muted,
    },
    linkMuted: { color: PDF_COLORS.muted, textDecoration: "underline" },
    recipientSection: {
      marginTop: 18,
      paddingTop: 14,
      borderTopWidth: 0.75,
      borderTopStyle: "dashed",
      borderTopColor: PDF_COLORS.border,
      gap: 3,
    },
    dateText: {
      fontFamily: "GeistMono",
      fontSize: 9 * s.body,
      marginBottom: 6,
    },
    recipientName: {
      fontFamily: "GeistMono",
      fontSize: 9.5 * s.body,
      fontWeight: 700,
    },
    recipientMeta: {
      fontFamily: "GeistMono",
      fontSize: 9 * s.body,
      color: PDF_COLORS.muted,
    },
    salutationText: {
      fontFamily: "GeistMono",
      fontSize: 9.5 * s.body,
      fontWeight: 700,
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
      fontFamily: "GeistMono",
      fontSize: 9 * s.body,
      color: PDF_COLORS.muted,
    },
    signatureName: {
      fontFamily: "GeistMono",
      fontSize: 10 * s.body,
      fontWeight: 700,
    },
  });

export function KetikCoverLetterPdf(props: { preview: CoverLetterPreview }) {
  const { preview } = props;
  const typography = pdfTypography(preview);
  const styles = makeStyles(fontScales(preview));
  const mono = "GeistMono";

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
            {/* Monospace Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <PdfHeaderPhoto header={preview.header} />
              <View>
                <Text style={[styles.name, { fontFamily: mono }]}>
                  {preview.header.fullName}
                </Text>
                {preview.header.headline ? (
                  <Text style={[styles.headline, { fontFamily: mono }]}>
                    {preview.header.headline}
                  </Text>
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
            </View>

            {/* Recipient details with dashed border */}
            <View style={styles.recipientSection}>
              {preview.date ? (
                <Text
                  style={styles.dateText}
                >{`// Date: ${preview.date}`}</Text>
              ) : null}

              {preview.recipientName ? (
                <Text style={styles.recipientName}>
                  {`> To: ${preview.recipientName}`}
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
