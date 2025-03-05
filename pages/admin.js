import Profile from "@/components/dashboard/profile";
import Theme from "@/components/dashboard/theme";
import Works from "@/components/dashboard/works";
import Layout from "@/components/Layout";
import { mediaUpload } from "@/utils/media";
import { fetchUserData, updateTheme } from "@/utils/profile";
import protectedRoute from "@/utils/protectedRoute";
import Link from "next/link";
import React, { useEffect, useState } from "react";
export const runtime = "experimental-edge";

function Admin() {
    const userName = localStorage.getItem('user_name');
    const userId = localStorage.getItem('user_id');
    const [pageLoader, setPageLoader] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");

    const fetchData = async (update) => {
        if (!update) {
            setPageLoader(true);
        }
        try {
            const user = await fetchUserData();
            setUserData(user);
        } catch (err) {
            setError(err.message);
        } finally {
            setPageLoader(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Layout page="dashboard">
            {pageLoader ? (
                <div className="loader"></div>
            ) : (
                <section className="max-w-3xl mx-auto p-4">
                    <div className="flex flex-wrap gap-10 justify-between my-7 font-medium">
                        <div className="sm:text-right text-center ">
                            <button onClick={() => setActiveTab('profile')} className={`${activeTab === 'profile' ? "text-primary font-semibold border-b-2" : ""}`}>
                                Profile
                            </button>
                            <button onClick={() => setActiveTab('theme')} className={`ml-6 ${activeTab === 'theme' ? "text-primary font-semibold border-b-2" : ""}`}>
                                Theme
                            </button>
                            <button onClick={() => setActiveTab('works')} className={`ml-6 ${activeTab === 'works' ? "text-primary font-semibold border-b-2" : ""}`}>
                                Works
                            </button>
                        </div>
                        <Link href={`/${userName + '-' + userId}`} target="_blank" className="flex gap-2 items-center">
                            <span className="hidden min-[400px]:block">View Portfolio</span>
                            <img src="/images/view.png" alt="" className="w-4" />
                        </Link>
                    </div>
                    {activeTab === 'profile' ? (
                        <Profile data={userData?.profile?.[0]} refreshUserData={() => fetchData(true)} />
                    ) : activeTab === 'theme' ? (
                        <Theme data={userData?.theme} refreshUserData={() => fetchData(true)} />
                    ) : activeTab === 'works' ? (
                        <Works data={userData?.work} refreshUserData={() => fetchData(true)} />
                    ) : (
                        <p></p>
                    )}
                </section>
            )}
        </Layout>
    );
}

export default protectedRoute(Admin);

