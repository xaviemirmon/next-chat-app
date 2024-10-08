import Link from "next/link";
import styles from "./ChatHeader.module.css";
import { Button } from "@/components/Button";
import { IoChevronBack, IoEllipsisHorizontal } from "react-icons/io5";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useUser } from "@/providers/UserProvider";

export const ChatHeader = ({
  userName,
  setLoading,
  router,
}: {
  userName: string | undefined;
  userId: number | undefined;
  setLoading: Dispatch<SetStateAction<boolean>>;
  router: AppRouterInstance;
}) => {
  const { user, logoutUser } = useUser();
  return (
    <div className={styles.header}>
      <div className={styles.profileLinks}>
        <Button
          variant="icon"
          onClick={() => {
            setLoading(true);
            logoutUser();
            router.push("/dashboard");
          }}
        >
          <IoChevronBack color={"#aeaeae"} />
        </Button>
        <div className={styles.userInfo}>
          <Image
            src={`https://i.pravatar.cc/30?img=${user}`}
            alt="Profile pic"
            height={30}
            width={30}
          />
          {userName}
        </div>
        <Button variant="icon">
          <IoEllipsisHorizontal color={"#aeaeae"} />
        </Button>
      </div>

      <Tabs />
    </div>
  );
};

const Tabs = () => (
  <div className={styles.tabs}>
    <Link href={"#"} className={`${styles.active} ${styles.tab}`}>
      Chat
    </Link>
    <Link href={"#"} className={`${styles.tab}`}>
      Profile
    </Link>
  </div>
);
