import { ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";

type BoosterItemProps = {
  title: string;
  titleSuffix?: ReactNode;
  description?: ReactNode;
  icon: ComponentType;
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  buttonLabel?: string;
};

const BoosterItemIconRight = () => (
  <svg
    width="9"
    height="16"
    viewBox="0 0 9 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L7.29289 7.29289C7.68342 7.68342 7.68342 8.31658 7.29289 8.70711L0.999999 15"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const BoosterItem = ({
  icon: Icon,
  title,
  titleSuffix,
  to,
  description,
  onClick,
  disabled,
  buttonLabel = "Use",
}: BoosterItemProps) => {
  if (to) {
    return (
      <Link to={to}>
        <div className="p-[15px_15px_15px_10px] rounded-[15px] flex gap-[10px] bg-white/[15%] items-center">
          <Icon />
          <section className="flex flex-col gap-[5px] flex-1">
            <div className="leading-[19px]">
              {title}{" "}
              {titleSuffix && (
                <span className="text-[13px] text-white/70">{titleSuffix}</span>
              )}
            </div>
            {description}
            <div className="text-[13px] text-[#D9A6E1] leading-[16px]"></div>
          </section>
          <BoosterItemIconRight />
        </div>
      </Link>
    );
  }
  return (
    <div className="p-[15px_15px_15px_10px] rounded-[15px] flex gap-[10px] bg-white/[15%] items-center">
      <Icon />
      <section className="flex flex-col gap-[5px] flex-1">
        <div className="leading-[19px]">
          {title}{" "}
          {titleSuffix && (
            <span className="text-[13px] text-white/70">{titleSuffix}</span>
          )}
        </div>
        {description}
        <div className="text-[13px] text-[#D9A6E1] leading-[16px]"></div>
      </section>
      {onClick && (
        <button
          className="p-[8px_10px] flex items-center justify-center button-bg-gradient rounded-[10px] min-w-[70px] font-semibold disabled:opacity-40"
          onClick={onClick}
          disabled={disabled}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
};
