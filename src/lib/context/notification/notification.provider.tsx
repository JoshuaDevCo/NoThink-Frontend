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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const onClose = () => setOpened(false);
  const toggle = () => setOpened((p) => !p);

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
              <div className="bg-[#4D1856]/[80%] rounded-[30px] p-[40px_50px] backdrop-blur-[20px] flex flex-nowrap overflow-hidden">
                {notifications.map((notification, i) => (
                  <div key={i} className="flex flex-col gap-[30px] ">
                    <div className="flex flex-col gap-[10px] items-center">
                      {notification.type === "bot" && <NoThinkBotBoosterIcon />}
                      <div className="text-[30px] font-extrabold">
                        {notification.label}
                      </div>
                      <div className="text-[13px] text-[#D9A6E1] text-center">
                        {notification.text}
                      </div>
                    </div>
                    <button
                      className="button-bg-gradient p-[20px_60px] rounded-full font-bold"
                      onClick={onClose}
                    >
                      OK, cool!
                    </button>
                  </div>
                ))}
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
