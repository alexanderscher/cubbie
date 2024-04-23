import React from "react";

interface TruncateTextProps {
  text: string;
  styles: string;
}

export const TruncateText = ({ text, styles }: TruncateTextProps) => {
  return <p className={`${styles} truncate-text`}>{text}</p>;
};
