'use client'
import React, { useState } from 'react';
import { QrScanner } from "react-qrcode-scanner";
import SendTx from '@/components/components/SendTx';
import SendNormalTx from '@/components/components/SendNormalTx';
import Dashboard from '@/components/components/Dashboard';
import "../../app/globals.css";

const QrScan = ({ onCloseMainModule }: any) => {
    const [qrCodeData, setQrCodeData] = useState<any>(null);
    const [scanning, setScanning] = useState<boolean>(true);
    const [txnTypes, setTxnTypes] = useState("");
    const previewStyle = {};

    const handleError = (error: any) => {
        console.error('Error scanning QR code:', error);
    };

    const handleCloseScanner = () => {
        setQrCodeData(null);
        setScanning(false);
        onCloseMainModule();
    };

    const handleScan = (data: string | null) => {
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                parsedData && parsedData.coin_name && parsedData.blockchain ? setTxnTypes("Normal") : setTxnTypes("Soundbox");
                setQrCodeData(parsedData);
                setScanning(false);
            } catch (error) {
                console.error('Error parsing QR code data:', error);
            }
        }
    };

    if (scanning) {
        return (
            <div className="w-full bg-white rounded relative">
                <div className='qrContainer'>
                    <QrScanner
                        style={previewStyle}
                        onError={handleError}
                        onScan={handleScan}
                        facingMode="environment"
                    />
                    <button
                        onClick={handleCloseScanner}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    if (qrCodeData) {
        return (
            <div className="w-full bg-white rounded relative">
                {txnTypes === "Soundbox" ? (
                    <SendTx
                        merchantAddress={qrCodeData.merchant_address}
                        merchantName={qrCodeData.merchant_name}
                        getdeviceId={qrCodeData.machine_id}
                    />
                ) : txnTypes === "Normal" ? (
                    <SendNormalTx
                        generateQrContent={qrCodeData}
                        handleCloseScanner={handleCloseScanner}
                    />
                ) : (
                    <Dashboard />
                )}
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded relative">
            <Dashboard />
        </div>
    );
};

export default QrScan;
