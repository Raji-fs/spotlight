import { useState, useEffect, useRef } from "react";
import moment from 'moment';

export default function WorkGallery({ theme, data }) {
  const [selectedMedia, setSelectedMedia] = useState(null);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };

    if (selectedMedia) {
      document.body.classList.add("overflow-hidden");
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMedia]);

  return (
    <div className="mx-auto">
      <div
        className={`grid  ${theme === "mega"? "grid-cols-1": "sm:grid-cols-2 lg:grid-cols-3 gap-6"}`}
      >
        {data?.map((work, index) => (
          <div
            key={index}
            className={`cursor-pointer w-full ${theme === "mega" ? "h-max" : "h-70"} mx-auto ${theme === "compact" && index === 0 && "sm:col-span-2"}`}
            onClick={() => setSelectedMedia(work)}
          >
            {work?.works ?
            <>
              {work?.works?.mimeType?.split("/")[0] === "image" ? (
                <img
                  src={work?.works?.url}
                  alt={`Gallery ${index + 1}`}
                  className={`object-cover w-full ${theme === "mega" ? "h-[34rem]" : "rounded h-full"} border border-gray`}
                />
              ) : (
                <div className={` w-full h-full  ${theme === "mega" ? "" : "rounded"} border border-gray`}>
                  <div className="relative z-[-1] w-full h-full" >
                  <video
                    className={`video object-cover w-full ${theme === "mega" ? "h-[34rem]" : "rounded h-full"} border border-gray`}
                    poster={work?.thumbnail}
                  >
                    <source src={work?.works?.url} type="video/mp4" />
                  </video>
                    <button
                      className="z-[2] absolute m-auto inset-0 flex items-center justify-center bg-black/40 text-white text-4xl rounded-full w-16 h-16 transition hover:bg-black/50"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              )}
            </>
            :
            <div className="w-full h-full border border-gray bg-[#EBEBEB] rounded" ></div>
            }
          </div>
        ))}
      </div>
      {selectedMedia && (
        <div
          className="z-[3] fixed inset-0 backdrop-blur-2xl bg-black/80 flex justify-center items-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 bg-white h-[70vh]">
              <div className="lg:col-span-2 overflow-hidden">
                {selectedMedia?.works ?
                <>
                  {selectedMedia?.works?.mimeType?.split("/")[0] === "image" ? (
                  <img
                    src={selectedMedia?.works?.url}
                    alt="Selected"
                    className="w-full h-auto min-h-full object-cover"
                  />) : (
                    <video
                      className={`w-full h-auto min-h-full object-cover`}
                      controls
                      autoplay
                      muted
                      controlsList='nodownload'
                      poster={selectedMedia?.works?.thumbnail}
                      preload="auto"
                    >
                      <source src={selectedMedia?.works?.url} type="video/mp4" />
                    </video>
                  )}
                </>
                :
                <div className="w-full h-full border border-gray bg-[#EBEBEB] rounded" ></div>
                }
              </div>
              <div className="p-6 overflow-y-auto">
                <h3 className="font-bold">{selectedMedia?.title}</h3>
                <p className="text-[#585858] text-xs pb-4">{moment(selectedMedia?.date).format('DD MMM, YYYY')}</p>
                <p className="text-sm">
                  {selectedMedia?.description}
                </p>
              </div>
            </div>
            <button
              className="absolute -top-3 -right-3"
              onClick={() => setSelectedMedia(null)}
            >
              <img
                src="/images/close_icon.png"
                alt="Close icon"
                className="w-6"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
