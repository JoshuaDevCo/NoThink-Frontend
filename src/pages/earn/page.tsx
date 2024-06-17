import { inviteApi } from "../../lib/apis/invite";
import { useGame } from "../../lib/hooks/useGame";
import { CoinIcon } from "../../assets/coin/icon";
import { useLayoutEffect, useState } from "react";
import cn from "classnames";
import { makeInviteLink } from "../../lib/utils/invite-link";

const BoughtIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.22223 16.5562L11.8889 21.2229L22.7778 10.334"
      stroke="url(#paint0_linear_13503_3125)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle
      cx="15"
      cy="15"
      r="14"
      stroke="url(#paint1_linear_13503_3125)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_13503_3125"
        x1="15"
        y1="10.334"
        x2="15"
        y2="21.2229"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#34D2AC" />
        <stop offset="1" stop-color="#26BEFF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_13503_3125"
        x1="15"
        y1="1"
        x2="15"
        y2="29"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#34D2AC" />
        <stop offset="1" stop-color="#26BEFF" />
      </linearGradient>
    </defs>
  </svg>
);

export const EarnPage = () => {
  const { challenge: challengeStore } = useGame();
  const [inviteId, setInviteId] = useState<string | null>(null);

  useLayoutEffect(() => {
    challengeStore.init();
    inviteApi.getLink().then((r) => {
      setInviteId(r.data._id);
    });
  }, []);
  return (
    <div className="absolute z-50 top-0 left-0 h-full w-full bg">
      <div className="px-[20px] pt-[20px] pb-[30px] h-full overflow-auto">
        <div className="card-bg-gradient p-[40px_50px] rounded-[30px] flex flex-col items-center gap-[10px] text-center">
          <div className="text-[30px] font-bold">Invite and Earn</div>
          <div className="text-[13px]">
            Users earn 100 coins for both the referrer and the referee upon
            successful referral.
          </div>

          <a
            href={makeInviteLink(inviteId || "")}
            className={cn(
              "button-bg-gradient mt-[30px] rounded-full flex gap-[10px] items-center p-[20px] w-full justify-center",
              {
                // "button-bg-gradient-dark": copied,
                // "button-bg-gradient": !copied,
                "opacity-40 pointer-events-none": !inviteId,
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

            <span className="shrink-0 font-bold">Share invite link</span>
          </a>
        </div>

        <div className="mt-[30px]">
          <div className="font-black mb-[20px] text-[14px]">Challenges</div>
          <div className="flex flex-col gap-[3px]">
            {challengeStore.list.map((challange, i) => (
              <div
                key={i}
                className={cn(
                  "flex justify-between items-center h-[70px] bg-white/15 px-[15px] rounded-[15px]",
                  {
                    "opacity-40": challengeStore.completed.find(
                      (el) => el.type === challange.type
                    )
                      ? challengeStore.completed.find(
                          (el) => el.type === challange.type
                        )?.claimed
                      : true,
                    "cursor-not-allowed": !challengeStore.completed.find(
                      (el) => el.type === challange.type
                    ),
                  }
                )}
              >
                <div>{challange.label}</div>
                {challengeStore.completed.some(
                  (el) => el.type === challange.type && el.claimed
                ) ? (
                  <BoughtIcon />
                ) : (
                  <button
                    disabled={
                      !challengeStore.completed.find(
                        (el) => el.type === challange.type
                      )
                    }
                    onClick={() => {
                      const _challenge = challengeStore.completed.find(
                        (el) => el.type === challange.type
                      );
                      console.log(_challenge);
                      if (!_challenge) return;
                      challengeStore.claim(_challenge._id);
                    }}
                    className="p-[8px_10px] flex gap-[10px] items-center rounded-[10px] button-bg-gradient [&>svg]:w-[12px] [&>svg]:h-[12px] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CoinIcon />+
                    {new Intl.NumberFormat().format(Number(challange.reward))}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* <div className="mt-[30px]">
          <div className="font-black">How it works:</div>

          <p className="mt-[20px] text-white/70 font-bold text-[13px]">
            If the both referrer and the referee have NUAH wallet the amount is
            10 000 coins - Provide users with a unique referral code or link to
            share with friends.
            <br />
            <br />
            Track referrals and ensure rewards are credited accurately.
          </p>
        </div> */}
      </div>
    </div>
  );
};
