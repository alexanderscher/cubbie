import { BeatLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="loading-overlay">
      <BeatLoader size={15} color={"rgb(6 78 59)"} />
    </div>
  );
}
