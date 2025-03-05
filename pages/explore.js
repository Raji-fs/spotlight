import Layout from "@/components/Layout";
import { fetchUsers } from "@/utils/profile";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
export const runtime = "experimental-edge";

export default function Explore() {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const fetchData = async (pageNum) => {
        if (!hasMore) return;
        setLoading(true);
        try {
            const response = await fetchUsers(pageNum);
            console.log("Fetched Data:", response);
            
            setUserData(prevData => [...prevData, ...response.docs]);
            setHasMore(response.hasNextPage);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const lastUserRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <Layout page="dashboard">
            <section className="max-w-3xl mx-auto p-4">
                <h2 className="text-lg font-bold mb-4">Profiles</h2>
                <ul className="profiles">
                    {userData.map((data, index) => {
                        const profileImage = `/images/${data?.theme?.theme || 'classic'}.png`;
                        return (
                            <li key={data?.id} ref={index === userData.length - 1 ? lastUserRef : null} className="flex justify-between gap-4 mb-4">
                                <div className="flex gap-4">
                                    <div>
                                        <img 
                                            src={profileImage} 
                                            alt={`${data?.theme?.theme || 'Classic'} Theme`} 
                                            className="w-20 h-20 border border-gray rounded-sm" 
                                            loading="lazy"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-lg">
                                            {data?.name} 
                                            <span className="text-sm text-gray">({data?.theme?.theme || 'Classic'})</span>
                                        </h3>
                                        <p className="text-secondary">{data?.profile?.[0]?.gradeOrDesignation}</p>
                                        <p className="text-secondary">{data?.profile?.[0]?.institutionOrOrganization}</p>
                                    </div>
                                </div>

                                <Link target="_blank" href={`/${data?.name + '-' + data?.id}`} className="flex gap-1 items-center text-sm text-primary font-medium">
                                    <span className="hidden sm:block">View Portfolio</span>
                                    <img alt="View Icon" className="w-3" src="/images/view.png" loading="lazy"/>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                {loading && <div className="loader"></div>}
            </section>
        </Layout>
    );
}
