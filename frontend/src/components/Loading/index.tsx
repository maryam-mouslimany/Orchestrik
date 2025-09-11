import React from "react";
import styles from "./styles.module.css";

type LoadingIndicatorProps = {
  fullscreen?: boolean;
  label?: string;
  className?: string;
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  fullscreen = true,
  label = "Loading",
  className = "",
}) => {
  return (
    <div
      className={`${styles.container} ${fullscreen ? styles.fullscreen : ""} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className={styles.spinner} />
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
};

export default LoadingIndicator;
