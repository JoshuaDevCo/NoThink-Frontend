import { useTonConnectUI } from "@tonconnect/ui-react";

export const ConnectionsPage = () => {
  const [tonConnectUI] = useTonConnectUI();

  const handleClick = () => {
    if (tonConnectUI.connected) {
      tonConnectUI.disconnect();
    } else {
      tonConnectUI.openModal();
    }
  };
  return (
    <div className="absolute z-50 top-0 left-0 h-full w-full bg">
      <div className="px-[20px] pt-[20px] pb-[30px] h-full overflow-auto">
        <section>
          <div className="mb-[10px] text-[14px] font-extrabold">
            Ton Wallet:
          </div>
          <div>
            <button
              className="button-bg-gradient p-[20px_60px] rounded-full font-bold"
              onClick={handleClick}
            >
              {tonConnectUI.connected ? "Disconnect" : "Connect Wallet"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
