import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { ethers, JsonRpcProvider } from "ethers";
import {
    isAddress,
    parseEther,
} from 'viem';
import {
    decrypted_data,
    renderContractMainAddress,
    renderContractTestAddress,
    renderTokenMainAddress,
    renderTokenTestAddress,
    rpcAllConfig,
    rpcMainConfig,
    rpcTestConfig
} from "@/utils/Helpers"
import { BlockBoltNew, monadabi, usdtABI } from "@/utils/abi";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/components/ui/card"
import SuccessModal from "./Success"

const SendNormalTx = ({ generateQrContent, handleCloseScanner }: any) => {
    const [txnDigest, setTxnDigest] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [jsonContent, setJsonContent] = useState<any>({});

    // https://mainnet-rpc.zkbase.app

    const dataResult = {
        amount: generateQrContent.amount,
        recipientAddress: generateQrContent.merchant_address,
        transactionId: txnDigest,
        chainName: generateQrContent.blockchain,
        coin: generateQrContent.coin_name
    }

    const onErrorMessage = (error: any) => {
        toast(error && error.message,
            {
                style: {
                    borderRadius: '10px',
                    background: '#FF2E2E',
                    color: '#fff',
                },
            }
        );
    }

    const sendToken = async (recipientAddress: any, signer: any) => {
        if (!signer) return;

        let blockboltAddress;
        if (generateQrContent.network == "mainnet") {
            blockboltAddress = await renderContractMainAddress(generateQrContent.blockchain);
        } else {
            blockboltAddress = await renderContractTestAddress(generateQrContent.blockchain);
        }
        if (blockboltAddress == undefined) return;

        const contract = new ethers.Contract(blockboltAddress, BlockBoltNew, signer);

        let tokenAddress;
        if (generateQrContent.network == "mainnet") {
            tokenAddress = await renderTokenMainAddress(generateQrContent.coin_name);
        } else {
            tokenAddress = await renderTokenTestAddress(generateQrContent.coin_name);
        }
        if (tokenAddress == undefined) return;

        try {
            const tx = await contract.transferToken(
                tokenAddress,
                recipientAddress,
                parseEther(generateQrContent.amount.toString()),
                generateQrContent.merchant_name,
                BigInt(generateQrContent.order_id),
            );
            const trig = await tx.wait();
            setTxnDigest(tx.hash);
            setShowSuccess(true);
            setShowLoading(false);
        } catch (error: any) {
            setShowLoading(false);
            onErrorMessage(error);
            console.error('Error sending transaction:', error);
        }
    };

    const sendBNB = async (recipientAddress: string, signer: any) => {
        if (!signer) return;

        let blockboltAddress;
        if (generateQrContent.network == "mainnet") {
            blockboltAddress = await renderContractMainAddress(generateQrContent.blockchain);
        } else {
            blockboltAddress = await renderContractTestAddress(generateQrContent.blockchain);
        }
        if (blockboltAddress == undefined) return;

        const contract = new ethers.Contract(blockboltAddress, BlockBoltNew, signer);

        try {
            const amountToSend = parseEther(generateQrContent.amount.toString());
            const tx = await contract.transfer(
                BigInt(generateQrContent.order_id),
                generateQrContent.merchant_name,
                recipientAddress,
                {
                    value: amountToSend
                }
            );
            const trig = await tx.wait();
            setTxnDigest(tx.hash);
            setShowSuccess(true);
            setShowLoading(false);
        } catch (error: any) {
            setShowLoading(false);
            onErrorMessage(error);
            console.error('Error sending transaction:', error);
        }
    };

    const onApproveToken = async (recipientAddress: any, signer: any) => {
        if (!signer) return;

        try {
            let blockboltAddress;
            if (generateQrContent.network == "mainnet") {
                blockboltAddress = await renderContractMainAddress(generateQrContent.blockchain);
            } else {
                blockboltAddress = await renderContractTestAddress(generateQrContent.blockchain);
            }
            if (blockboltAddress == undefined) return;

            let contractAddress;
            if (generateQrContent.network == "mainnet") {
                contractAddress = await renderTokenMainAddress(generateQrContent.coin_name);
            } else {
                contractAddress = await renderTokenTestAddress(generateQrContent.coin_name);
            }
            if (contractAddress == undefined) return;

            const amount = parseEther(generateQrContent.amount)
            const contract = new ethers.Contract(contractAddress, usdtABI, signer);
            const tx = await contract.approve(
                blockboltAddress, amount
            );
            const trig = await tx.wait();
            sendToken(recipientAddress, signer);
        } catch (error: any) {
            setShowLoading(false);
            onErrorMessage(error);
            console.error('Error sending transaction:', error);
        }

    };

    const transferMonadCoin = async (signer: any) => {
        if (!signer) return;

        const blockboltAddress = jsonContent.blockboltAddress;
        const orderId = String(generateQrContent.order_id).trim();
        const contract = new ethers.Contract(blockboltAddress, monadabi, signer);

        try {
            const amountToSend = parseEther(generateQrContent.amount.toString());
            const tx = await contract.transfer(
                orderId,
                generateQrContent.merchant_name,
                generateQrContent.merchant_address,
                {
                    value: amountToSend,
                    // gasLimit: BigInt(500000)
                }
            );
            const trig = await tx.wait();
            setTxnDigest(tx.hash);
            setShowSuccess(true);
            setShowLoading(false);
        } catch (error: any) {
            setShowLoading(false);
            onErrorMessage(error);
            console.error('Error sending transaction:', error);
        }
    }

    const onPaymentSend = async () => {
        try {
            const provider = new JsonRpcProvider(jsonContent.rpc, {
                chainId: jsonContent.chainId,
                name: jsonContent.name
            });
            const getMnemonic = localStorage.getItem("wallet:mnemonic");
            const TEST_MNEMONICS = decrypted_data(getMnemonic!);
            const walletMnemonic = ethers.Wallet.fromPhrase(TEST_MNEMONICS)
            const signer = walletMnemonic.connect(provider)

            setShowLoading(true);
            if (!generateQrContent.merchant_address || !generateQrContent.amount) {
                toast('Address and amount are required');
                setShowLoading(false);
                return;
            }
            const isValidAddress = isAddress(generateQrContent.merchant_address);
            if (!isValidAddress) {
                toast('Invalid address');
                setShowLoading(false);
                return;
            }
            if (!/^[0-9]+(\.[0-9]+)?$/.test(generateQrContent.amount)) {
                toast("Amount must be a valid number");
                setShowLoading(false);
                return;
            }
            if (generateQrContent.coin_name == "BNB" || generateQrContent.coin_name == "ETH") {
                sendBNB(generateQrContent.merchant_address, signer);
            } else if (generateQrContent.coin_name == "MON") {
                transferMonadCoin(signer);
            } else {
                onApproveToken(generateQrContent.merchant_address, signer);
            }
        } catch (error) {
            console.log('finally', error);
        }
    };

    useEffect(() => {
        if (generateQrContent && Object.keys(generateQrContent).length > 0) {
            if (generateQrContent.blockchain == "Monad") {
                setJsonContent(rpcAllConfig.MONAD);
            } else if (generateQrContent.blockchain == "BASE") {
                generateQrContent.network == "mainnet" ?
                    setJsonContent(rpcMainConfig.BASE) :
                    setJsonContent(rpcTestConfig.BASE)
            } else if (generateQrContent.blockchain == "Binance") {
                generateQrContent.network == "mainnet" ?
                    setJsonContent(rpcMainConfig.BNB) :
                    setJsonContent(rpcTestConfig.BNB)
            } else {
                console.warn('Unknown blockchain type:', generateQrContent.blockchain);
            }
        }
    }, [generateQrContent]);

    return (
        <>
            <div className="flex h-screen justify-center items-center">
                <Toaster />
                <Card className="w-full max-w-md modelWrapper">
                    <CardHeader>
                        <div className='flex'>
                            <div>
                                <CardTitle>Send Crypto</CardTitle>
                                <CardDescription>Enter the details to send your cryptocurrency.</CardDescription>
                            </div>
                            <span className='cursorPointer' onClick={() => !showLoading && handleCloseScanner()}>Close</span>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={generateQrContent.merchant_name}
                                readOnly
                                placeholder="Enter recipient name"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                value={generateQrContent.amount}
                                readOnly
                                placeholder="Enter amount to send"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={generateQrContent.merchant_address}
                                readOnly
                                placeholder="Enter recipient address"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Coin</Label>
                            <Input
                                id="name"
                                value={generateQrContent.coin_name}
                                readOnly
                                placeholder="Enter coin"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Blockchain</Label>
                            <Input
                                id="name"
                                value={generateQrContent.blockchain}
                                readOnly
                                placeholder="Enter chain"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-gray-900 text-gray-50 hover:bg-gray-900/90" onClick={onPaymentSend}>
                            {showLoading ? 'Sending...' : 'Send'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            {showSuccess && <SuccessModal dataResult={dataResult} handleCloseScanner={handleCloseScanner} isOpen={showSuccess} />}
        </>
    );
};

export default SendNormalTx;