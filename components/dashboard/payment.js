import { fetchUsers, makePayment } from "@/utils/payment";
import { useEffect, useState } from "react";

export default function Payment({ daysLeft, freeTrial }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const payment = async () => {
        setLoading(true);
        try {
            await makePayment();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="sticky top-0 z-10 payment_bar bg-primary text-white w-full flex items-center justify-between p-4">
                {freeTrial ? 'Free Trial' : 'Your Plan' } ends in {daysLeft} {daysLeft === 1 ? "day" : "days"}
                <button 
                    className="bg-white text-primary font-medium py-1 px-5 rounded-lg"
                    onClick={payment}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>
            </div>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </>
    );
}
