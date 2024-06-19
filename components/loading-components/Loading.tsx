import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

interface LoadingProps {
  loading: boolean;
}

const Loading = ({ loading }: LoadingProps) => {
  return (
    <div className="highest-overlay">
      <BeatLoader loading={loading} size={15} color={"rgb(6 78 59)"} />
    </div>
  );
};

export default Loading;
