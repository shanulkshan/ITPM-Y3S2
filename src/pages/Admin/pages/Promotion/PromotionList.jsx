
import React, { useEffect, useState } from "react";
import GameBookingCancel from "./PromotionCancel";
import { PrinterIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const PromotionList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/promotion/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
                alert("Deleted Successfully");
                toggleModal()
                window.location.reload();
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }

        return false;
    };

    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        const getPromotion = async () => {
            try {
                const res = await fetch(`/api/promotion`);
                const data = await res.json();
                if (res.ok) {
                    setPromotions(data)
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        getPromotion();
    }, [])

    return (
        <div>
            <div className="flex items-center justify-between pb-5">
                <h1 className="text-2xl font-semibold text-gray-800 default:text-white">
                    Promotion List
                </h1>

            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 default:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 default:bg-gray-700 default:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-6">
                                Id
                            </th>
                            <th scope="col" className="px-6 py-6">
                                item Name
                            </th>
                            <th scope="col" className="px-6 py-6">
                                Old Price
                            </th>
                            <th scope="col" className="px-6 py-6">
                                Discount (%)
                            </th>
                            <th scope="col" className="px-6 py-6">
                                New Price
                            </th>
                            <th scope="col" className="px-6 py-6">
                                Start Date
                            </th>
                            <th scope="col" className="px-6 py-6">
                                End Date
                            </th>
                            <th scope="col" className="px-6 py-6 text-red-500 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.map((data, index) => (
                            <tr
                                key={index}
                                className="bg-white border-b default:bg-gray-800 default:border-gray-700 hover:bg-gray-50 default:hover:bg-gray-600"
                            >
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4">{data.itemName}</td>
                                <td className="px-6 py-4">{Number(data.oldPrice)?.toFixed(2)}</td>
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap default:text-white"
                                >
                                    {data.discountRate}%
                                </th>
                                <td className="px-6 py-4">{Number(data.newPrice)?.toFixed(2)}</td>
                                <td className="px-6 py-4">{data.startDate}</td>
                                <td className="px-6 py-4">{data.endDate}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-center">

                                        <button
                                            onClick={() => window.location.replace(`/admin/promotion-view/${data?._id}/list`)}
                                            className="text-white bg-blue-500 ms-5 p-2 rounded"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => window.location.replace(`/admin/promotion-edit/${data?._id}`)}
                                            className="text-white bg-orange-500 ms-5 p-2 rounded"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <GameBookingCancel
                                            isOpen={isModalOpen}
                                            toggleModal={toggleModal}
                                            onDetele={() => handleDelete(data?._id)}
                                        />
                                        <button
                                            onClick={() => window.location.replace(`/admin/promotion-qr-code/${data?._id}`)}
                                            className="text-white bg-green-500 ms-5 p-2 rounded"
                                        >
                                            <PrinterIcon className="w-4 h-4" />
                                        </button>
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PromotionList;
