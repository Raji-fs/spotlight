import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Classic from "@/components/theme/Classic";
import Compact from "@/components/theme/Compact";
import Neo from "@/components/theme/Neo";
import Mega from "@/components/theme/Mega";
import { fetchUserData } from "@/utils/profile";
export const runtime = "experimental-edge";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [works, setWorks] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const user = await fetchUserData(slug?.split('-').pop());
        setUserData(user);
        setWorks(user?.work);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="loader"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        <p>Error: {error}</p>
      </div>
    );
  }
  const profile = userData?.profile?.[0];
  const theme = userData?.theme?.theme || "classic";

  return (
    <Layout>
      {theme === "classic" ? (
        <Classic
          data={profile}
          coverImage={userData?.theme?.coverImage?.url || "/images/cover_image.png"}
          workData={works}
        />
      ) : theme === "compact" ? (
        <Compact
          data={profile}
          coverImage={userData?.theme?.coverImage?.url || "/images/cover_image.png"}
          workData={works}
        />
      ) : theme === "neo" ? (
        <Neo data={profile} workData={works} />
      ) : (
        <Mega data={profile} workData={works} />
      )}
    </Layout>
  );
}
