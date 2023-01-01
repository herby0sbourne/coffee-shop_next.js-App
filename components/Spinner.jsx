import styles from "./spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.center}>
      <div className={styles.spinner}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Spinner;
