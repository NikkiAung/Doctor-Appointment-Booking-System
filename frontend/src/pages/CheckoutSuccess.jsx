import { useEffect,useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../contexts/AppContext";

const CheckoutSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("sessionId");
    const {BACKEND_URL,token} = useContext(AppContext);
    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                toast.error("Session ID is missing!");
                return;
            }

            try {
                // Verify payment status with session ID
                const { data } = await axios.post(
                    BACKEND_URL + '/api/user/session_status',
                    { sessionId },
                    {headers:{token}}
                );

                if (data.status === "complete") {
                    // Update database for payment completion
                    const { data: updateResponse } = await axios.post(
                        BACKEND_URL + '/api/user/updating-db-payment',
                        { appointmentId: data.client_reference_id }, // Use client_reference_id
                        {headers:{token}}
                    );

                    if (updateResponse.success) {
                        toast.success("Payment recorded successfully!");
                    } else {
                        toast.error("Failed to update payment status in the database.");
                    }
                } else {
                    toast.error("Payment incomplete or canceled.");
                }
            } catch (error) {
                console.error("Error verifying payment:", error);
                toast.error("An error occurred while verifying the payment status.");
            }
        };

        verifyPayment();
    }, [sessionId]);

    return (
        <div className="bg-gray-100 h-screen">
            <div className="bg-white p-6 md:mx-auto">
                <div className="flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="100"
                        height="100"
                        viewBox="0 0 48 48"
                    >
                        <linearGradient
                            id="I9GV0SozQFknxHSR6DCx5a_70yRC8npwT3d_gr1"
                            x1="9.858"
                            x2="38.142"
                            y1="9.858"
                            y2="38.142"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#21ad64"></stop>
                            <stop offset="1" stopColor="#088242"></stop>
                        </linearGradient>
                        <path
                            fill="url(#I9GV0SozQFknxHSR6DCx5a_70yRC8npwT3d_gr1)"
                            d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                        ></path>
                        <path
                            fill="#fff"
                            d="M21.293,32.707l-8-8c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414c0.391-0.391,1.024-0.391,1.414,0	L22,27.758l10.879-10.879c0.391-0.391,1.024-0.391,1.414,0l1.414,1.414c0.391,0.391,0.391,1.024,0,1.414l-13,13	C22.317,33.098,21.683,33.098,21.293,32.707z"
                        ></path>
                    </svg>
                </div>
                <div className="text-center">
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                        Payment Done!
                    </h3>
                    <p className="text-gray-600 my-2">
                        Thank you for completing your secure online payment.
                    </p>
                    <p>Have a great day!</p>
                    <div className="py-10 text-center">
                        <Link
                            to="/"
                            className="px-12 bg-black text-white font-semibold py-3"
                        >
                            Go Back To Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
