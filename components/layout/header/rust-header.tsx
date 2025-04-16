import styles from "./styles.module.css";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Divider from "./divider";

export interface Page {
  title: string;
  description: string;
  metaTitle?: string;

  // tooltip
  infoTooltip?: boolean;
  tooltipDescription?: string;
  tooltipCta?: string;
  tooltipHref?: string;

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

  altStyle?: boolean;
  widthV2?: boolean;
}

export default function RustHeader({
  page,
  actionBar,
  className = "bg-transparent",
}: {
  page: Page;
  actionBar?: any;
  className?: string;
}) {
  return (
    <div
      className={cn(
        page.altStyle ? styles.fullHeaderWrapperAlt : styles.fullHeaderWrapper,
        className
      )
      }
    >
      <div
        className={cn(
          styles.headerWrapper,
          page.widthV2
            ? styles.headerWrapperWidthV2
            : styles.headerWrapperWidth,
        )}
      >
        <div className={styles.headerContainer}>
          <div className={styles.headerStack}>
            <div className={styles.innerStack}>
              <div className={styles.innerContainer}>
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

                      <h1 className={styles.primaryTitle}>{page.title}</h1>
                    </div>
                    {page.backLink && (
                      <div className={styles.secondaryWrapper}>
                        <Link
                          href={page.backLink}
                          className={styles.detailsLayoutBackLink}
                        >
                          <ArrowLeft
                            size={24}
                            className={styles.backLinkIcon}
                          />
                          <p className={styles.textWrapper}>
                            {page.backLinkText}
                          </p>
                        </Link>
                        <Divider className={styles.dividerIcon} />
                        <div className={styles.localeTextContainer}>
                          <p className={styles.localeText}>{page.location}</p>
                        </div>
                      </div>
                    )}
                    {page.description && (
                      <div className={styles.secondaryWrapper}>
                        <p className={styles.textWrapper}>
                          {page.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {page.metaBar && (
                    <div className={styles.secondaryContainer}>
                      {page.metaItem1 && (
                        <div className={styles.secondaryContainerCol}>
                          <p className={styles.textWrapper}>
                            {page.metaItem1.key}
                          </p>

                          <span className={styles.tooltipContainer}>
                            <p className={styles.textWrapperPrimary}>
                              {page.metaItem1.value}
                            </p>
                          </span>
                        </div>
                      )}
                      {page.metaItem2 && (
                        <div className={styles.secondaryContainerCol}>
                          <p className={styles.textWrapper}>
                            {page.metaItem2.key}
                          </p>

                          <span className={styles.tooltipContainer}>
                            <p className={styles.textWrapperPrimary}>
                              {page.metaItem2.value}
                            </p>
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {actionBar && (
                    <div className={styles.secondaryContainer}>{actionBar}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
