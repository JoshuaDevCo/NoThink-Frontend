import { createPortal } from "react-dom";
import { useGame } from "../../lib/hooks/useGame";
import { NoThinkBotBoosterIcon } from "../../assets/boosters/no_think_bot";
import { AnimatePresence, motion } from "framer-motion";

type AutoTapperModalProps = {
  onClose: () => void;
  open: boolean;
};

export const AutoTapperModal = ({ open, onClose }: AutoTapperModalProps) => {
  const { counter } = useGame();
  const { auto_tapped } = counter;
  if (auto_tapped === 0) return null;
  return createPortal(
    <AnimatePresence initial={false}>
      {open && (
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
          <div className="bg-[#4D1856]/[80%] rounded-[30px] p-[40px_50px] flex flex-col gap-[30px] backdrop-blur-[20px]">
            <div className="flex flex-col gap-[10px] items-center">
              <NoThinkBotBoosterIcon />
              <div className="text-[30px] font-extrabold">
                +{new Intl.NumberFormat().format(auto_tapped)}
              </div>
              <div className="text-[13px] text-[#D9A6E1] text-center">
                You got this! Your NO-THINK Bot has just mined coins for you!
              </div>
            </div>
            <button
              className="button-bg-gradient p-[20px_60px] rounded-full font-bold"
              onClick={onClose}
            >
              OK, cool!
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
