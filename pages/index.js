import Layout from "@/components/Layout";
export const runtime = "experimental-edge";

export default function Home() {
  return (
     <Layout page="dashboard">
        <div className="px-8 py-4">
            <div className="rounded-xl flex items-center justify-center text-center"  style={{minHeight : 'calc(100vh - 125px)'}}>
                <div>
                    <h2 className="text-5xl font-bold mt-8 mb-3 text-[#112BB5]">Showcase</h2>
                    <h3 className="text-4xl font-normal mb-3 text-[#264FD6]">Your work</h3>
                    <p className="text-3xl font-thin text-[#9747FF]">Your way</p>
                    <img src="/images/banner.png" alt="Banner" className="object-contain -mt-3.5 sm:-mt-9 sm:max-w-[640px]" />
                </div>
            </div>
        </div>
    </Layout>
  );
}
