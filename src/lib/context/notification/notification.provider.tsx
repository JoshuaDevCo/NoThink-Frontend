import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { INotificationContext, Notification } from "./notification.types";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { NoThinkBotBoosterIcon } from "../../../assets/boosters/no_think_bot";
import cn from "classnames";
import { CoinIcon } from "../../../assets/coin/icon";

const ArrowRight = () => (
  <svg
    width="6"
    height="10"
    viewBox="0 0 6 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.25 8.5L4.04289 5.70711C4.43342 5.31658 4.43342 4.68342 4.04289 4.29289L1.25 1.5"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
const ArrowLeft = () => (
  <svg
    width="6"
    height="10"
    viewBox="0 0 6 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.75 8.5L1.95711 5.70711C1.56658 5.31658 1.56658 4.68342 1.95711 4.29289L4.75 1.5"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const NotificationContext = createContext<INotificationContext>({
  toggle: function (): void {
    throw new Error("Function not implemented.");
  },
  append: function (): void {
    throw new Error("Function not implemented.");
  },
  notifications: [],
});

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const [opened, setOpened] = useState(false);
  const [index, setIndex] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const onClose = () => setOpened(false);
  const toggle = () => setOpened((p) => !p);

  const next = () => setIndex((p) => p + 1);
  const prev = () => setIndex((p) => p - 1);

  const append = useCallback((notification: Notification) => {
    setNotifications((p) => {
      if (notification.type === "bot") {
        return [notification, ...p.filter((el) => el.type !== "bot")];
      } else if (notification.type === "invited") {
        const botIndex = p.findIndex((el) => el.type === "bot");
        if (botIndex === -1) return [notification, ...p];
        const h = [...p];
        return h.splice(botIndex, 0, notification);
      } else {
        return [...p, notification];
      }
    });
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      setOpened(true);
    }
  }, [notifications.length]);
  return (
    <NotificationContext.Provider value={{ notifications, append, toggle }}>
      {createPortal(
        <AnimatePresence initial={false}>
          {opened && (
            <motion.div
              className="fixed inset-0 flex items-center justify-stretch px-[20px] z-50"
              initial="hidden"
              animate="open"
              exit="hidden"
              variants={{
                open: { opacity: 1 },
                hidden: { opacity: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-[#4D1856]/[80%] rounded-[30px] p-[40px_50px] backdrop-blur-[20px] flex overflow-hidden relative">
                {notifications
                  .filter((_, i) => i === index)
                  .map((notification, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-[20px] w-full"
                      style={{ transform: `translateX(${-100 * index}%)` }}
                    >
                      <div className="flex flex-col gap-[10px] items-center">
                        {notification.type === "bot" && (
                          <NoThinkBotBoosterIcon />
                        )}
                        {notification.type === "invited" && (
                          <CoinIcon className="w-[60px] h-[60px]" />
                        )}
                        <div className="text-[30px] font-extrabold">
                          {notification.label}
                        </div>
                        <div className="text-[13px] text-[#D9A6E1] text-center">
                          {notification.text}
                        </div>
                      </div>
                      {notifications.length - 1 == index && (
                        <button
                          className="button-bg-gradient p-[20px_60px] rounded-full font-bold"
                          onClick={onClose}
                        >
                          OK, cool!
                        </button>
                      )}
                    </div>
                  ))}
                {notifications.length > 1 && (
                  <button
                    onClick={next}
                    className="absolute right-[10px] top-[50%] translate-y-[-50%] w-[30px] h-[30px] rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <ArrowRight />
                  </button>
                )}
                {notifications.length > 1 && index != 0 && (
                  <button
                    onClick={prev}
                    className="absolute left-[10px] top-[50%] translate-y-[-50%] w-[30px] h-[30px] rounded-full bg-white/20 flex items-center justify-center"
                  >
                    <ArrowLeft />
                  </button>
                )}
                {notifications.length > 1 && (
                  <div className="mt-[30px] flex items-center justify-center">
                    <div className="flex gap-[8px]">
                      {notifications.map((_, i) => (
                        <span
                          className={cn(
                            "rounded-full bg-white transition-all duration-300 w-[7px] h-[7px]",
                            {
                              "opacity-40": i !== index,
                            }
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
