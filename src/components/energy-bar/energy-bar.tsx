import { EnergyIcon } from "../../assets/energy/icon";
import { useGame } from "../../lib/hooks/useGame";

export const EnergyBar = () => {
  const { counter } = useGame();
  const { energy: current, max_energy: max } = counter;
  return (
    <div className="flex gap-[10px] items-center">
      <div>
        <EnergyIcon />
      </div>
      <span>
        {current}/{max}
      </span>
      <div className="relative bg-white/5 h-[7px] rounded-full flex-1 overflow-hidden">
        <div
          style={{
            width: `${(current / max) * 100}%`,
          }}
          className="h-full gradient-progress-indicator"
        />
      </div>
    </div>
  );
};
