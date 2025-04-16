import styles from "./styles.module.css";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MaxWidthWrapper from "../max-width-wrapper";
import { cn } from "@/lib/utils";

export interface Page {
  title: string;
  titleMarginTop?: string;
  metaTitle?: string;

  // tooltip
  infoTooltip?: boolean;
  tooltipDescription?: string;
  tooltipCta?: string;
  tooltipHref?: string;

  heroDescription?: string;
  backLink?: string;
  backLinkText?: string;
  location?: string;
  icon?: any;

  // set title and action button in the same row on mobile
  actionRow?: boolean;

  //  secondary container
  metaBar?: boolean;
  metaItem1?: { key: string; value: string };
  metaItem2?: { key: string; value: string };

  //  row 2
  row2?: boolean;
  metaCopy1?: { key: string; value: string };
  metaCopy2?: { key: string; value: string };
  metaCopy3?: { key: string; value: string };
}

const gridData = [
  {
    title: "Nameservers",
    value: "Third Party",
  },
  {
    title: "Registrar",
    value: "Google Domains",
  },
  {
    title: "Expiry Date",
    value: "2023-01-01",
  },
  {
    title: "Transfer Lock",
    value: "Enabled",
  },
  {
    title: "Auto Renew",
    value: "Enabled",
  },
  {
    title: "Privacy Protection",
    value: "Enabled",
  },
  {
    title: "DNSSEC",
    value: "Enabled",
  },
];

export const GridCell = ({ title, value }) => {
  return (
    <div className={styles.gridCellContainer}>
      <div className={styles.gridCellWrapper}>
        <div className={styles.gridCellTitle}>{title}</div>
        <div className={styles.gridCellContentWrapper}>
          <div className={styles.gridCellContent}>{value}</div>
        </div>
      </div>
    </div>
  );
};

export default function GridHeader({
  page,
  actionBar,
}: {
  page: Page;
  actionBar?: any;
}) {
  return (
    <div className={styles.fullHeaderWrapper}>
      <MaxWidthWrapper>
        <div className={styles.headerContainer}>
          <div className={styles.gridHeaderStack}>
            <div className={styles.innerStack}>
              <div className={styles.gridInnerContainer}>
                <div
                  className={cn(
                    page?.actionRow
                      ? styles.innerWrapperMobileRow
                      : styles.innerWrapper,
                  )}
                >
                  <div className={styles.primaryContainer}>
                    <div className={styles.primaryWrapper}>
                      {page.icon && (
                        <div className={styles.primaryIconWrapper}>
                          {page.icon}
                        </div>
                      )}
                      <h1
                        style={{ marginTop: page?.titleMarginTop }}
                        className={styles.primaryTitle}
                      >
                        {page.title}
                      </h1>
                    </div>
                  </div>

                  {actionBar && (
                    <div className={styles.secondaryContainer}>{actionBar}</div>
                  )}
                </div>

                {page.row2 && (
                  <>
                    <div className={styles.gridInnerWrapperSecondary}>
                      <div className={styles.gridInnerWrapperCol}>
                        <div className={styles.gridInnerGrid}>
                          {gridData.map((item, index) => (
                            <GridCell
                              key={index}
                              title={item.title}
                              value={item.value}
                            />
                          ))}
                        </div>
                        <div className="rust-spacer" />
                        <div className={styles.gridBackRow}>
                          <Link
                            href={page.backLink as string}
                            className={styles.detailsLayoutBackLink}
                          >
                            <ArrowLeft
                              size={24}
                              className={styles.backLinkIcon}
                            />
                            <p className={styles.textWrapper}>Back</p>
                          </Link>
                        </div>
                        <div className="rust-spacer" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
