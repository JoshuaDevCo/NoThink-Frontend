import { useState } from "react";
import { CoinIcon } from "../../assets/coin/icon";
import cn from "classnames";
import { useLaunchParams } from "@tma.js/sdk-react";
import { useGame } from "../../lib/hooks/useGame";
import { inviteApi } from "../../lib/apis/invite";
import copy from "copy-to-clipboard";

export const TablePage = () => {
  const { initData } = useLaunchParams();
  const { counter, stat } = useGame();
  const { count, total_balance } = counter;
  const { list, invited_list, place } = stat;
  const [activeTab, setActiveTab] = useState<"all" | "friends">("all");
  const [copied, setCopied] = useState(false);
  const handleGetLink = () => {
    inviteApi.getLink().then((r) => {
      copy(`t.me/no_think_coin_bot/startapp?startapp=${r.data._id}`);
      setCopied(true);
    });
  };
  return (
    <div className="absolute z-50 top-0 left-0 h-full w-full bg">
      <div
        className="px-[20px] pt-[20px] pb-[30px] flex flex-col gap-[15px] h-full overflow-auto"
        id="main"
      >
        <section className="flex flex-col items-center">
          <div>
            <span className="font-semibold text-[#FEBDFF]">#{place} </span>
            <span className="font-black">
              {initData?.user?.firstName} {initData?.user?.lastName} (
              {initData?.user?.username})
            </span>
          </div>
          <div className="[&>svg]:w-[20px] [&>svg]:h-[20px] flex gap-[5px] mt-[10px]">
            <CoinIcon />
            <span className="font-semibold">
              {new Intl.NumberFormat().format(total_balance + count)}
            </span>
          </div>
        </section>
        <div className="flex">
          <button
            onClick={() => setActiveTab("all")}
            className={cn("rounded-l-[10px] w-full p-[8px_10px]", {
              "bg-white/5": activeTab === "friends",
              "button-bg-gradient": activeTab === "all",
            })}
          >
            All tappers
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={cn("rounded-r-[10px] w-full p-[8px_10px]", {
              "bg-white/5": activeTab === "all",
              "button-bg-gradient": activeTab === "friends",
            })}
          >
            Your friends
          </button>
        </div>
        {activeTab === "friends" && (
          <div>
            <button
              onClick={handleGetLink}
              className={cn(
                "rounded-full flex gap-[10px] items-center p-[20px] w-full justify-center",
                {
                  "button-bg-gradient-dark": copied,
                  "button-bg-gradient": !copied,
                }
              )}
            >
              <svg
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M7.375 7.875C9.13541 7.875 10.5625 6.44791 10.5625 4.6875C10.5625 2.92709 9.13541 1.5 7.375 1.5C5.61459 1.5 4.1875 2.92709 4.1875 4.6875C4.1875 6.44791 5.61459 7.875 7.375 7.875Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M1 18.5V15.3125C1 12.9644 2.90187 11.0625 5.25 11.0625H9.5C9.87187 11.0625 10.2225 11.105 10.5625 11.2006"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14.8125 18.5L18 15.3125L14.8125 12.125"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18 15.3125H11.625"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span className="shrink-0 font-bold">
                {!copied ? "Invite friends" : "Link copied!"}
              </span>
            </button>
          </div>
        )}
        <section className="flex flex-col gap-[3px]">
          {(activeTab === "all" ? list : invited_list).map((item, i) => (
            <div
              key={item._id}
              className={cn(
                "flex justify-between items-center p-[10px] rounded-[5px]",
                {
                  "bg-white/5": i + 1 !== place,
                  "bg-white/15 border border-[#FF81FF]": i + 1 === place,
                }
              )}
            >
              <div className="text-[14px]">
                <span className={cn({ "text-[#FEBDFF]": i + 1 === place })}>
                  #{i + 1}{" "}
                </span>
                <span className={cn({
                  "font-bold": i + 1 !== place,
                  "font-[860]": i + 1 === place,
                })}>
                  {item.telegram_details?.username || item._id}
                </span>
              </div>
              <div className="[&>svg]:w-[12px] [&>svg]:h-[12px] flex gap-[5px] items-center">
                <CoinIcon />
                <span className="font-semibold">
                  {new Intl.NumberFormat().format(item.score)}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
