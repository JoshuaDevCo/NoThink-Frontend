import { ComponentType } from "react";
import { useNavigate } from "react-router-dom";

type NavigationItemProps = {
  icon: ComponentType;
  title: string;
  to?: string;
};

export const NavigationItem = ({
  icon: Icon,
  title,
  to,
}: NavigationItemProps) => {
  const navigate = useNavigate();
  return (
    <button
      className="flex flex-col gap-[6px] items-center"
      onClick={() => {
        if (!to) {
          return;
        }
        navigate(to);
      }}
    >
      <div
        className="bg-white/10 border border-[#FFB3FF] flex items-center justify-center w-[60px] h-[60px] rounded-[15px]"
        style={{ boxShadow: "0 0 30px 0 #FFB3FF" }}
      >
        <Icon />
      </div>
      <div>{title}</div>
    </button>
  );
};
