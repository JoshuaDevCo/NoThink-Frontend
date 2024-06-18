import { Outlet } from "react-router-dom";
import { CoinIcon } from "../../assets/coin/icon";
import { IconNavigationCup } from "../../assets/navigation/cup";
import { IconNavigationLeafCoin } from "../../assets/navigation/leaf-coin";
import { IconNavigationRocket } from "../../assets/navigation/rocket";
import { IconTapper } from "../../assets/tapper/icon";
import { EnergyBar } from "../../components/energy-bar";
import { NavigationItem } from "../../components/navigation";
import { formatNumber } from "../../lib/utils/format-number";
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import cn from "classnames";
import { useGame } from "../../lib/hooks/useGame";
import { AnimatePresence, motion } from "framer-motion";
import { BackgroundVideo } from "../../components/background-video/background-video";
import { useGameTick } from "../../lib/hooks/useGameTick";
import { ZenPowerBoosterIcon } from "../../assets/boosters/zen_power";
import { postEvent } from "@tma.js/sdk-react";

const DEBUG = false;

const getRandomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const IndexPage = () => {
  const coinRef = useRef<HTMLButtonElement>(null);
  const frameTime = useGameTick();
  const { counter, stat } = useGame();
  const {
    click,
    count,
    sync,
    total_balance,
    inited,
    tap_value,
    multiplier,
    energy,
  } = counter;
  const { score: totalCoinsTapped, tappers } = stat;

  const [clicks, setClicks] = useState<
    {
      x: number;
      y: number;
      value: number;
      multiplier: number;
      date: number;
      duration: number;
    }[]
  >([]);
  const [lastUpdate, setLastUpdate] = useState(performance.now());

  const debounced = useCallback(
    debounce(() => {
      sync();
    }, 2000),
    []
  );

  const handleClick = useCallback(() => {
    click();
    debounced();
  }, [debounced, click]);

  useEffect(() => {
    if (clicks.length === 0) return;
    if ((frameTime - lastUpdate) / 1000 >= 10) {
      setClicks((p) => p.filter((item) => (frameTime - item.date) / 1000 < 10));
      setLastUpdate(performance.now());
    }
  }, [frameTime]);

  return (
    <>
      <BackgroundVideo
        y={
          coinRef.current?.getBoundingClientRect()
            ? coinRef.current?.getBoundingClientRect().top +
              coinRef.current?.getBoundingClientRect().height / 2
            : undefined
        }
      />

      <div className="px-[40px] h-full z-50 relative">
        <div>
          {clicks.map((click) => (
            <motion.span
              key={click.date}
              className={cn(
                "absolute z-20 pointer-events-none aspect-square rounded-full font-black flex items-center justify-center",
                {
                  "border border-red-500": DEBUG,
                  "bg-[#FF81FF] text-white": click.value == 2,
                  "bg-yellow-300 text-black": click.value != 2,
                }
              )}
              animate={{ x: click.x - 40, y: 0, opacity: 0, width: "20px" }}
              initial={{ x: click.x - 40, y: click.y - 40, width: "60px" }}
              transition={{ ease: "linear", duration: click.duration }}
            >
              {click.value * click.multiplier}
            </motion.span>
          ))}
        </div>
        {DEBUG && (
          <div className="absolute right-0 bottom-0">{clicks.length}</div>
        )}

        <div className="grid grid-rows-[auto_1fr_auto] gap-[40px] h-full">
          <div className="flex flex-col gap-[20px]">
            <EnergyBar />
            <div className="text-white text-[40px] leading-[1] font-bold text-center justify-center flex items-center gap-[10px]">
              <CoinIcon />
              <span className={cn({ "text-[30px]": count > 1e5 })}>
                {formatNumber(total_balance + count)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center relative">
            {tap_value == 2 && (
              <ZenPowerBoosterIcon className="zen-power-animation p-[10px] absolute top-[50%] left-[50%] z-0 w-[350px] h-[350px] button-bg-gradient rounded-full" />
            )}
            <motion.button
              id="click_circle"
              ref={coinRef}
              className="rounded-full w-[270px] h-[270px] z-1 relative select-none"
              onClick={(e) => {
                if (energy > 0)
                  setClicks((p) =>
                    p.concat({
                      x:
                        e.clientX +
                        (Math.random() > 0.5 ? 1 : -1) * getRandomRange(0, 100),
                      y: e.clientY - getRandomRange(50, 70),
                      value: tap_value,
                      multiplier: multiplier,
                      date: performance.now(),
                      duration: getRandomRange(1, 2),
                    })
                  );
                handleClick();
                postEvent("web_app_trigger_haptic_feedback", {
                  type: "impact",
                  impact_style: "medium",
                });
              }}
              onTouchStart={() => {}}
              onTouchEnd={() => {}}
              whileTap={{ scale: 0.8 }}
            />
          </div>
          <div className="flex flex-col items-center gap-[20px]">
            <div className="flex gap-[20px] items-center text-[14px] leading-[1.2] tracking-[-.4px] font-semibold">
              <div className="flex gap-[10px] items-center">
                <IconTapper />
                <span>{formatNumber(tappers)}</span>
              </div>
              <div className="flex gap-[10px] items-center">
                <CoinIcon className="w-[20px] h-[20px]" />
                <span>{formatNumber(totalCoinsTapped)}</span>
              </div>
            </div>
            <nav className="flex items-center gap-[20px]">
              <NavigationItem
                to={"/table"}
                icon={IconNavigationCup}
                title="Tappers"
              />
              <NavigationItem
                to={"/boosters"}
                icon={IconNavigationRocket}
                title="Boost"
              />
              <NavigationItem
                icon={IconNavigationLeafCoin}
                title="Earn"
                to="/earn"
              />
            </nav>
          </div>
        </div>
        <Outlet />
      </div>
      <AnimatePresence>
        {!inited && (
          <motion.div
            initial="open"
            animate="open"
            exit="hidden"
            variants={{
              open: { opacity: 1 },
              hidden: { opacity: 0 },
            }}
            transition={{
              duration: 1,
              delay: 0.3,
            }}
            className="fixed z-[100] bg-white/10 inset-0 backdrop-blur-[15px] flex flex-col items-center justify-center"
          >
            <motion.img
              key="inital"
              initial="hidden"
              animate="open"
              exit="hidden"
              variants={{
                open: { scale: 1, opacity: 1 },
                hidden: { scale: 0.8, opacity: 0 },
              }}
              transition={{
                duration: 1,
                bounceDamping: 5,
                bounceStiffness: 150,
                mass: 1,
                type: "spring",
              }}
              src="/thumbnail.svg"
              alt=""
            />
            <div className="text-[30px] font-black">
              loading
              <AnimatePresence key="dots">
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  .
                </motion.span>
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  .
                </motion.span>
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{
                    delay: 0.6,
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                >
                  .
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Outlet />
    </>
  );
};
