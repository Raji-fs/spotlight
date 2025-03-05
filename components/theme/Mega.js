import Link from "next/link";
import { useState, useEffect } from "react";
import WorkGallery from "../WorkGallery";

export default function Mega({ data, workData }) {
  const [activeTab, setActiveTab] = useState("Portfolio");
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.getElementById("header");
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  return (
    <div className="w-full">
      <section id="header" className="py-4 sm:py-8 sticky top-0 bg-white border-b border-[#B2B2B2] px-14 z-[1]">
        <div className="user_name flex flex-wrap gap-x-5 gap-y-3 items-center justify-center sm:justify-start col-span-2">
          <Link href="/"><img src="/images/spotlight_logo.png" alt="" className="w-28 top-7"/></Link>
          <h2 className="text-2xl font-bold capitalize">{data?.firstname} {data?.lastname}</h2>
          <p>{data?.gradeOrDesignation || "No Role"} - {data?.institutionOrOrganization || "No Organization"}</p>
        </div>
      </section>
      <section className="md:flex content w-full">
        <div className="sticky h-max flex md:flex-col justify-evenly md:justify-start gap-2 text-left md:min-w-48  md:px-14 py-4 md:pt-7 bg-white"
            style={{top: `${headerHeight}px`}}>
          <button
            onClick={() => setActiveTab('Portfolio')}
            className={`text-start ${activeTab === 'Portfolio' ? "font-semibold" : "font-normal"}`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('About')}
            className={`text-start  ${activeTab === 'About' ? "font-semibold" : "font-normal"}`}
          >
            About
          </button>
        </div>
        {activeTab === 'Portfolio' ?
          <div className="gallery w-full">
            <WorkGallery theme='mega' data={workData}/>
          </div>
        :
          <div className="profile_data my-7 ">
            <div className="col-span-3 flex flex-col items-center md:items-start px-14 max-w-xl mx-auto">
              <img
                src={`${data?.ProfileImage?.url || '/images/profile_placeholder.png'}`}
                alt="profile image"
                className="w-40 h-40 object-cover rounded-full mb-5 bg-gray relative z-1"
              />
              {typeof(data?.intro) === 'string' ?
                <p className="intro text-sm 0">{data?.intro}</p>
              :
                <>
                {data?.intro?.map((block, blockIndex) => (
                  <p className="intro text-sm 1" key={blockIndex}>
                    {block.children.map((child, childIndex) => (
                      <span key={childIndex} style={{ fontWeight: child.bold ? "bold" : "normal" }}>
                        {child.text}
                      </span>
                    ))}
                  </p>
                ))}
                </>
              }
              <div className="social_links flex gap-4 items-center justify-center mt-12">
                  {data?.linkedin && (
                  <Link href={data?.linkedin} target="_blank" rel="noopener noreferrer">
                      <img src="/images/linkedin.png" alt="Linkedin" className="w-6" />
                  </Link>
                  )}
                  {data?.instagram && (
                  <Link href={data?.instagram} target="_blank">
                      <img src="/images/instagram.png" alt="Instagram" className="w-6" />
                  </Link>
                  )}
                  {data?.x && (
                  <Link href={data?.x} target="_blank">
                      <svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                  </Link>
                  )}
                  {data?.email && (
                  <Link href={`mailto:${data?.email}`}>
                      <img src="/images/email.png" alt="Email" className="w-6" />
                  </Link>
                  )}
                  {data?.phone && (
                  <Link href={`tel:${data?.phone}`}>
                      <img src="/images/phone.png" alt="Phone" className="w-6" />
                  </Link>
                  )}
              </div>
            </div>
          </div>
        }
      </section>
    </div>
  );
}
