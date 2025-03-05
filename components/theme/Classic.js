import Link from "next/link";
import WorkGallery from "../WorkGallery";

export default function Classic({ data, coverImage, workData }) {
  return (
    <>
      <section className="cover_image bg-zinc-300 relative">
        <img src={coverImage} alt="cover image" className="w-full min-h-60 max-h-60 object-cover" />
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <img src="/images/spotlight_logo.png" alt="" className="absolute w-28 top-7" />
          </Link>
        </div>
      </section>
      <section className="content max-w-3xl mx-auto px-6 lg:px-0">
        <div className="profile_data grid sm:grid-cols-3 gap-6">
          <div className="col-span-2">
            <img
              src={`${data?.ProfileImage?.url || '/images/profile_placeholder.png'}`}
              alt="profile image"
              className="w-40 h-40 object-cover rounded-full -mt-20 mb-5 bg-gray relative z-1"
            />
            <h2 className="user_name text-2xl font-bold pb-1.5">
              {data?.firstname} {data?.lastname}
            </h2>
            <h3 className="designation font-medium pb-5">
              {data?.gradeOrDesignation || "No Role"} - {data?.institutionOrOrganization || "No Organization"}
            </h3>
            
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
            
          </div>
          <div className="social_links flex gap-4 items-end justify-end">
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
        <div className="gallery my-14">
          <WorkGallery data={workData} />
        </div>
      </section>
    </>
  );
}
