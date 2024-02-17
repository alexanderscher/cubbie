interface TruncateTextProps {
  text: string;
  maxLength: number;
  styles: string;
}
export const TruncateText = ({
  text,
  maxLength,
  styles,
}: TruncateTextProps) => {
  const truncated =
    text.length > maxLength ? `${text.substr(0, maxLength)}...` : text;

  return <p className={styles}>{truncated}</p>;
};
