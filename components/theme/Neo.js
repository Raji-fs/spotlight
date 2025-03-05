import Link from "next/link";
import { useState } from "react";
import WorkGallery from "../WorkGallery";

export default function Neo({ data, workData }) {
  const [activeTab, setActiveTab] = useState("Portfolio");

  return (
    <div className="w-full mx-auto px-6 lg:px-14">
      <section className="sm:grid sm:grid-cols-4 py-4 sm:py-8 sticky top-0 bg-white">
        <div className="user_name flex flex-wrap gap-x-5 gap-y-3 items-center justify-center sm:justify-start col-span-3 ">
        <Link href="/"><img src="/images/spotlight_logo.png" alt="" className="w-28 top-7"/></Link>
          <h2 className="text-2xl font-bold ">{data?.firstname} {data?.lastname}</h2>
          <p>{data?.gradeOrDesignation || "No Role"} - {data?.institutionOrOrganization || "No Organization"}</p>
        </div>
        <div className="sm:text-right text-center w-full mt-4 sm:mt-0">
          <button
            onClick={() => setActiveTab('Portfolio')}
            className={`${activeTab === 'Portfolio' ? "font-semibold" : "font-normal"}`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('About')}
            className={`pl-6 ${activeTab === 'About' ? "font-semibold" : "font-normal"}`}
          >
            About
          </button>
        </div>
      </section>
      <section className="content w-full">
        {activeTab === 'Portfolio' ?
          <div className="gallery mb-7">
            <WorkGallery data={workData} />
          </div>
        :
          <div className="profile_data my-14  max-w-xl mx-auto">
            <div className="col-span-3 text-center">
              <img
                src={`${data?.ProfileImage?.url || '/images/profile_placeholder.png'}`}
                alt="profile image"
                className="w-40 h-40 object-cover rounded-full mb-5 mx-auto bg-gray relative z-1"
              />
              <h2 className="user_name text-2xl font-bold pb-1.5">
                {data?.firstname} {data?.lastname}
              </h2>
              <h3 className="designation font-medium pb-5">
                {data?.gradeOrDesignation || "No Role"} - {data?.institutionOrOrganization || "No Organization"}
              </h3>
              {typeof(data?.intro) === 'string' ?
                <p className="intro text-sm">{data?.intro}</p>
              :
                <>
                {data?.intro?.map((block, blockIndex) => (
                  <p className="intro text-sm" key={blockIndex}>
                    {block.children.map((child, childIndex) => (
                      <span key={childIndex} style={{ fontWeight: child.bold ? "bold" : "normal" }}>
                        {child.text}
                      </span>
                    ))}
                  </p>
                ))}
                </>
              }
              <div className="social_links flex gap-4 items-center justify-center mt-6">
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
