import { useDispatch, useSelector } from "react-redux";
import App from "../subComponents/modal";
import { useEffect, useState } from "react";
import { deleteCardThunk, getSaveCardThunk } from "../Redux/cardSlice";
import visa from '../../assets/images/visa.png';
import master from '../../assets/images/master.png';
import { fireToastMessage } from "../../toastContainer";
import { SwalFireDelete } from "../../swalFire";

export default function WithdrawEarning() {
    const dispatch = useDispatch();
    const { data } = useSelector((s) => s.cardData);
    const [selectedCardId, setSelectedCardId] = useState(null); // State for storing selected card ID

    useEffect(() => {
        const handleApi = async () => {
            await dispatch(getSaveCardThunk());
        };
        handleApi();
    }, [dispatch]);

    const handleCardSelect = (id) => {
        const handleDelete = async () => {
            try {
                const { status, data } = await dispatch(deleteCardThunk(id)).unwrap();
                if (status === 200) {
                    fireToastMessage({ success: true, message: data.message })
                    await dispatch(getSaveCardThunk());
                }
            } catch (error) {
                fireToastMessage({ type: "error", message: error.message });
            }
        }
        SwalFireDelete({handleDelete, title: "Are you sure you want to delete this card info?"})
    };

    const handleGetPaid = () => {
        if (selectedCardId) {
            // Add logic here to proceed with payment using selectedCardId
        } else {
            fireToastMessage({ type: "error", message: "No card selected" })
        }
    };

    return (
        <div className="padding-navbar1">
            <div className="padding-navbar1 shadow rounded-xl py-10 my-10">
                <p className="lg:text-3xl text-2xl font-bold">Withdraw Earning</p>
                <div className="flex justify-between items-center flex-wrap">
                    <div>
                        <p className="text-2xl font-bold my-4">Available Balance: $20.00</p>
                    </div>
                    {data?.data && data?.data.length > 0 && <App head="Payments" withDraw={true} />}
                </div>

                {data?.data && data?.data.length > 0 ? (
                    data?.data?.map((v) => (
                        <div key={v.id} className="padd-card border rounded-2xl py-8 my-5">
                            <div className="flex justify-between flex-wrap">
                                <div>
                                    <img
                                        className="w-10 h-8 object-contain"
                                        src={v?.card?.brand === 'visa' ? visa : master}
                                        alt="card type"
                                    />
                                    <p className="Classico text-base font-bold mt-2">{v?.billing_details?.name}</p>
                                    <p className="Belleza text-base">**** **** **** {v?.card?.last4}</p>
                                </div>
                                <div>
                                    <button
                                        style={{ background: "#FCE4E4", color: "#EA5455" }}
                                        className="Belleza rounded-full w-28 py-2 mb-2"
                                        onClick={() => handleCardSelect(v.id)}
                                    >
                                        Delete
                                    </button>
                                    <p style={{ color: "#6F6B7D" }} className="Belleza text-sm">
                                        Card expires at {v?.card?.exp_month}/{v?.card?.exp_year}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2 pt-4">
                                <input
                                    type="radio"
                                    name="selectedCard"
                                    value={v.id}
                                    onChange={() => setSelectedCardId(v.id)}
                                    checked={selectedCardId === v.id} // Mark as checked if selected
                                />
                                <p className="Montserrat font-normal text-sm">Use as the payment method</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="border rounded-2xl text-center py-8">
                        <p className="text-4xl Classico font-normal">To withdraw earnings, first you need to set up a withdrawal method.</p>
                        <p className="pt-8 pb-10">You haven't set up any withdrawal methods yet.</p>
                        <div className="flex justify-center">
                            <App head="Payments" withDraw={true} />
                        </div>
                    </div>
                )}

                {data?.data && data?.data.length > 0 && (
                    <div className="flex justify-center">
                        <button
                            style={{ background: "#38AEE3", color: "#FFFFFF" }}
                            className="w-52 py-2 Quicksand rounded-full"
                            onClick={handleGetPaid} // Call the handleGetPaid function on click
                        >
                            Withdraw Payment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
