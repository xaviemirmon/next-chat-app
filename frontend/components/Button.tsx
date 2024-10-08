import styles from "./Button.module.css";

export const Button = ({
  onClick,
  children,
  variant = "primary",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: string;
}) => (
  <button className={styles[variant]} onClick={onClick}>
    {children}
  </button>
);
