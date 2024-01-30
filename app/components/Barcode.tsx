import { useZxing } from "@/utils/useZxing";

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onResult = () => {},
  onError = () => {},
}) => {
  const { ref } = useZxing({ onResult, onError });
  return <video ref={ref} />;
};
