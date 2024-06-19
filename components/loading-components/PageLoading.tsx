import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

interface LoadingProps {
  loading: boolean;
}

const PageLoading = ({ loading }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <BeatLoader loading={loading} size={15} color={"rgb(6 78 59)"} />
    </div>
  );
};

export default PageLoading;
