import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function ViewPromotion() {

    const { promotionId, location } = useParams();

    const [promotion, setPromotion] = useState({
        _id: "",
        itemName: "",
        itemId: "",
        itemImage: "",
        shopName: "",
        stallNumber: undefined,
        floorNumber: undefined,
        oldPrice: "",
        discountRate: "",
        newPrice: "",
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        const getPromotion = async () => {
            try {
                const res = await fetch(`/api/promotion/${promotionId}`);
                const data = await res.json();
                if (res.ok) {
                    setPromotion(data)
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        getPromotion();
    }, [promotionId])

    const handleBack = () => {
        if (location === 'list') {
            window.location.replace("/admin/promotion-list");
        }
        else {
            window.location.replace("/qr-scan");
        }
    }

    return (
        <div class="max-w-xl mx-auto bg-white shadow-lg rounded-md p-6">
            <h1 class="text-2xl font-bold mb-4">View Promotion</h1>
            <div class="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">

                <div class="mb-4">
                    <h3 class="text-2xl font-bold mb-4"><span >{promotion?.shopName}</span></h3>
                    <div class="flex items-center">
                        <img
                            src={promotion?.itemImage}
                            alt="item"
                            class="w-full h-64 object-cover rounded-md"
                        />

                    </div>
                </div>

                <div class="mb-4">
                    <div>
                        <h2 class="text-gray-800 font-semibold" style={{ textAlign: 'center', fontSize: "25px" }}>{promotion?.itemName}</h2>
                    </div>
                    <div className='mb-4' >
                        <p class="text-green-600 font-semibold" style={{ textAlign: 'center', fontSize: "22px" }}>{promotion?.discountRate}% off</p>
                    </div>

                    <div class="flex gap-4 justify-center items-center mb-4">
                        <div class="text-center">
                            <span class="text-gray-600" style={{ fontSize: '18px' }}>Old Price:  <span style={{ color: 'blue' }}>{Number(promotion.oldPrice)?.toFixed(2)} LKR </span></span>

                        </div>
                    </div>

                    <div class="flex gap-4 justify-center items-center mb-4">
                        <div class="text-center " >
                            <span class="text-gray-600 " style={{ fontSize: '18px' }}>New Price: <span style={{ color: 'blue' }}>{Number(promotion.newPrice)?.toFixed(2)} LKR</span></span>
                        </div>
                    </div>

                    <div class="flex gap-4 justify-center items-center mb-4" style={{ fontSize: '18px' }}>
                        <div class="text-center ">
                            <span class="text-gray-600">Start Date:  <span style={{ color: 'blue' }}>{promotion.startDate} </span></span>

                        </div>
                        <div class="text-center " style={{ marginLeft: '50px' }}>
                            <span class="text-gray-600">End Date: <span style={{ color: 'blue' }}>{promotion.endDate}</span></span>
                        </div>
                    </div>

                    <div class="flex gap-4 justify-center items-center" style={{ fontSize: '18px' }}>
                        <div class="text-center " >
                            <span class="text-gray-600">Shop Location : <span style={{ color: 'blue' }}>Floor {promotion?.floorNumber} Stall {promotion?.stallNumber}</span></span>
                        </div>
                    </div>

                </div>

                <div class="flex justify-center">
                    <button onClick={() => { handleBack() }} class="px-16 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Back</button>
                </div>
            </div>

        </div>

    )
}

export default ViewPromotion