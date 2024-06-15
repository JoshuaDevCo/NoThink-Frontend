import { useEffect, useRef } from "react";

type BackgroundVideoProps = {
  y?: number;
};
export const BackgroundVideo = ({ y }: BackgroundVideoProps) => {
  const url = "/background.mp4";

  const videoRef = useRef<HTMLVideoElement>(null);
  const rect = videoRef?.current?.getBoundingClientRect();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "y",
      y ? y - (rect?.height || 0) / 2 + "px" : "center"
    );
  }, [y]);
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen bg-black z-10 opacity-20"></div>
      <video
        className="fixed top-0 left-0 w-[150%] z-[5]"
        style={{
          objectPosition: `center ${
            y ? y - (rect?.height || 0) / 2 + "px" : localStorage.getItem("y")
          }`,
        }}
        ref={videoRef}
        loop
        muted
        controls={false}
        playsInline
      >
        <source src={url} type="video/mp4" />
      </video>
    </>
  );
};
