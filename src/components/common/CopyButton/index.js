import React from "react";
import styles from "./index.module.scss";

const CopyButton = ({ clipboardText }) => {
  const handleClick = (e) => {
    e.target.focus();
    navigator.clipboard.writeText(clipboardText);
  }
  
  return (
    <button
      tabIndex="-1"
      className={styles.copyButton}
      onClick={(e) => handleClick(e)}
    >
      <div className={styles.copiedText}>Copied ✓</div>
      <div className={styles.uncopiedText}>Copy</div>
    </button>
  );
};
export default CopyButton;
