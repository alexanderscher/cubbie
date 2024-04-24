import React from "react";

interface TruncateTextProps {
  text: string;
  styles: string;
  type?: string;
  maxLength?: number;
}

export const TruncateText = ({
  text,
  styles,

  maxLength,
}: TruncateTextProps) => {
  if (maxLength) {
    const truncated =
      text.length > maxLength ? `${text.substr(0, maxLength)}...` : text;
    return <p className={styles}>{truncated}</p>;
  } else {
    return <p className={`${styles} truncate-text`}>{text}</p>;
  }
};
