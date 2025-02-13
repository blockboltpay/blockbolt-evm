import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { shimmerTestnet, bscTestnet, baseSepolia } from 'viem/chains';
import {
    createPublicClient,
    formatEther,
    http,
    isAddress,
    parseEther,
    // parseEther 
} from 'viem';
import { blockBolt, usdtABI, } from '@/utils/abi'
import { JsonRpcProvider, ethers } from 'ethers';
import {
    blockboltIotaAddress, blockboltBaseAddress, blockboltBnbAddress, usdcBaseAddress, usdcBnbAddress, usdcIotaAddress, usdtBaseAddress, usdtBnbAddress, usdtIotaAddress,
    usdcPolygonAddress,
    usdtPolygonAddress,
    resolution, decrypted_data, sound_box_url, sound_provider_id
} from "@/utils/Helpers"
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast';
import SuccessModal from "./Success"


interface Balance {
    USDC?: string;
    USDT?: string;
}

interface SendTxProps {
    merchantAddress: string;
    merchantName: string;
    getdeviceId: string;
}

const SendTx: React.FC<SendTxProps> = ({ merchantAddress, merchantName, getdeviceId }) => {
    const getNetworkChain = localStorage.getItem('chain:name');
    const getMnemonic = localStorage.getItem("wallet:mnemonic");
    const [address, setAddress] = useState(merchantAddress);
    const [name, setName] = useState(merchantName);
    const [amount, setAmount] = useState("");
    // const [coin, setCoin] = useState("");
    const [coin, setCoin] = useState<'usdc' | 'usdt'>('usdc');
    const [network, setNetwork] = useState("");
    const [txnDigest, setTxnDigest] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [recipientAddr, setRecipientAddr] = useState('');
    const [jsonContent, setJsonContent] = useState<any>({});
    const [balances, setBalances] = useState<Record<Network, Balance>>({} as Record<Network, Balance>);
    const [loading, setLoading] = useState<boolean>(true);


    const getWalletAddr = async (domain: string): Promise<string | null> => {
        const ticker: string = 'ETH';
        try {
            const address = await resolution.addr(domain, ticker);
            if (address) {
                console.log(`Domain ${domain} has address for ${ticker}: ${address}`);
                setRecipientAddr(address)
                return address;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const onCopyText = () => {
        navigator.clipboard.writeText(txnDigest);
        toast('Copied!');
    };

    const txnWithSoundBox = (getAmount: any, coin: string) => {
        console.log(coin);

        const data = {
            device_id: getdeviceId,
            ip_key: sound_provider_id,
            text: `Received ${getAmount} ${coin} on ${jsonContent.name} chain On Blockbolt`,
        };
        try {
            axios
                .post(sound_box_url, data)
                .then(() => {
                    console.log('success');
                })
                .catch(() => {
                    console.log('fail');
                });
        } catch (error: any) {
            console.log('error', error);
        }
    };

    type Network = 'BASE' | 'BNB' | 'IOTA' | 'POLYGON';

    interface ChainConfig {
        name: string;
        rpc: string;
        chainId: number;
        blockboltAddress: string;
        usdcAddress: string;
        usdtAddress: string;
    }
    // RPC Configurations
    const rpcConfig: Record<Network, ChainConfig> = {
        BASE: {
            name: 'BASE',
            rpc: 'https://base-sepolia.g.alchemy.com/v2/Fb8rIgjDR9607bSeMkRk-j_KpRojLni4',
            chainId: 84532,
            blockboltAddress: blockboltBaseAddress,
            usdcAddress: usdcBaseAddress,
            usdtAddress: usdtBaseAddress
        },
        BNB: {
            name: 'BNB',
            rpc: 'https://bsc-rpc.publicnode.com',
            chainId: 56,
            blockboltAddress: blockboltBnbAddress,
            usdcAddress: usdcBnbAddress,
            usdtAddress: usdtBnbAddress
        },
        IOTA: {
            name: 'IOTA',
            rpc: 'https://json-rpc.evm.testnet.iotaledger.net',
            chainId: 1075,
            blockboltAddress: blockboltIotaAddress,
            usdcAddress: usdcIotaAddress,
            usdtAddress: usdtIotaAddress
        },
        POLYGON: {
            name: "POLYGON",
            rpc: "https://rpc-amoy.polygon.technology",
            chainId: 80002,
            blockboltAddress: blockboltIotaAddress,
            usdcAddress: usdcPolygonAddress,
            usdtAddress: usdtPolygonAddress
        }
    };

    const getRpcConfig = (chain: any) => {
        let config;
        switch (chain) {
            case 'BASE':
                config = rpcConfig.BASE;
                break;
            case 'BNB':
                config = rpcConfig.BNB;
                break;
            case 'IOTA':
                config = rpcConfig.IOTA;
                break;
            case 'POLYGON':
                config = rpcConfig.POLYGON;
                break;
            default:
                throw new Error('Unsupported chain');
        }
        setJsonContent(config);
    };

    const triggerEVMTx = async (recipientAddress: string, signer: any) => {
        if (!signer) return;
        try {
            setShowLoading(true);
            console.log(address);
            let contractAddress;
            const currentNetwork = network as Network;

            if (coin === 'usdc') {
                contractAddress = jsonContent.usdcAddress;

            } else if (coin === 'usdt') {
                contractAddress = jsonContent.usdtAddress;
            } else {
                // sendEth(recipientAddress);
                return;
            }
            console.log(contractAddress);


            // const contractAddress = usdtAddress;
            const contract = new ethers.Contract(contractAddress, usdtABI, signer);

            const tx = await contract.approve(

                jsonContent.blockboltAddress, parseEther("100")
            );
            console.log(`Transaction hash: ${tx.hash}`);

            const trig = await tx.wait();

            // sendToken();
            sendToken(recipientAddress, signer);

        } catch (error) {
            console.log('error block', error);
        }
    };

    const sendToken = async (recipientAddress: string, signer: any) => {


        if (!signer) return;

        const contractAddressBlock = jsonContent.blockboltAddress;
        const contract = new ethers.Contract(contractAddressBlock, blockBolt, signer);

        if (!signer) return;
        let contractAddress;

        if (coin === 'usdc') {
            contractAddress = jsonContent.usdcAddress;

        } else if (coin === 'usdt') {
            contractAddress = jsonContent.usdtAddress;
        } else {
            // sendEth(recipientAddress);
            return;
        }

        console.log(contractAddress, "token");

        try {
            const tx = await contract.transferToken(
                // coin === 'usdc' ? jsonContent.usdcAddress : jsonContent.usdtAddress,
                contractAddress,
                recipientAddress,
                parseEther(amount),
                "demo",
                1132
            );
            console.log('Function call result:', tx);
            console.log(`Transaction hash: ${tx.hash}`);
            const trig = await tx.wait();
            setTxnDigest(tx.hash);
            setShowLoading(false);
            setShowSuccess(true)
            txnWithSoundBox(amount, coin)
        } catch (error) {
            console.error('Error sending transaction:', error);
        }
    };

    const sendEth = async (recipientAddress: string, signer: any) => {
        if (!signer) return;

        try {
            const tx = await signer.sendTransaction({
                to: recipientAddress,
                value: parseEther(amount)
            });
            console.log(`Transaction hash: ${tx.hash}`);
        } catch (error) {
            console.error('Error sending transaction:', error);
        }
    };

    const onPaymentSend = async () => {

        const provider = new JsonRpcProvider(jsonContent.rpc, {
            chainId: jsonContent.chainId,
            name: jsonContent.name
        });
        const getMnemonic = localStorage.getItem("wallet:mnemonic");
        const TEST_MNEMONICS = decrypted_data(getMnemonic!);
        const walletMnemonic = ethers.Wallet.fromPhrase(TEST_MNEMONICS)

        // const walletKey = await walletMnemonic.getAddress()
        const signer = walletMnemonic.connect(provider)
        console.log('first', provider)
        setShowLoading(true);
        if (!address || !amount) {
            toast('Address and amount are required');
            setShowLoading(false);
            return;
        }

        const domains = ['.unstoppable', '.dao', '.nft', '.bitcoin', '.polygon', '.x', '.pudgy', '.zil', '.blockchain', '.austin', '.unstoppable', '.go', '.888'];

        let recipientAddress = address;
        const domainFound = domains.some(domain => address.includes(domain));


        if (domainFound) {
            const resolvedAddress = await getWalletAddr(address);
            if (resolvedAddress) {
                recipientAddress = resolvedAddress;
            } else {
                toast('Invalid Unstoppable Domain');
                setShowLoading(false);
                return;
            }
        }
        // console.log(address);


        const isValidAddress = isAddress(recipientAddress);
        if (!isValidAddress) {
            toast('Invalid address');
            setShowLoading(false);
            return;
        }

        if (!/^[0-9]+(\.[0-9]+)?$/.test(amount)) {
            toast("Amount must be a valid number");
            setShowLoading(false);
            return;
        }

        triggerEVMTx(recipientAddress, signer);
    };

    const getTokenBalance = async (tokenAddress: string, label: any, jsonContent: ChainConfig,) => {

        const provider = new JsonRpcProvider(jsonContent.rpc, {
            chainId: jsonContent.chainId,
            name: jsonContent.name
        });

        const TEST_MNEMONICS = decrypted_data(getMnemonic!);
        const walletMnemonic = ethers.Wallet.fromPhrase(TEST_MNEMONICS);
        const addr = walletMnemonic.address
        const signer = walletMnemonic.connect(provider);

        try {
            const contract = new ethers.Contract(tokenAddress, usdtABI, signer);
            const tx = await contract.balanceOf(addr);
            const balance = formatEther(tx)
            return balance;
        } catch (error) {
            console.log(`Error fetching ${label} balance:`, error);
        }
    };


    const getBalancesForAllChains = async (coin: 'usdc' | 'usdt') => {

        const balancePromises = Object.values(rpcConfig).map(chainConfig =>
            getTokenBalance(
                coin === 'usdc' ? chainConfig.usdcAddress : chainConfig.usdtAddress,
                coin.toUpperCase(),
                chainConfig,
            )
        );

        const balances = await Promise.all(balancePromises);

        const results = Object.keys(rpcConfig).reduce((acc, chainName, index) => {
            acc[chainName as Network] = {
                [coin.toUpperCase()]: balances[index]
            };
            return acc;
        }, {} as Record<Network, { USDC?: string; USDT?: string }>);

        setBalances(results);
        return results;
    };


    const fetchBalances = async (selectedCoin: 'usdc' | 'usdt') => {
        setLoading(true);
        try {
            const fetchedBalances = await getBalancesForAllChains(selectedCoin);
            setBalances(fetchedBalances);
        } catch (error) {
            console.error('Error fetching balances:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalances(coin);
    }, [coin]);



    const dataResult = {
        amount: 1,
        recipientAddress: recipientAddr,
        transactionId: txnDigest,
        chainName: jsonContent.name,
        coin: coin
    }

    return (
        <>
            <div className="flex h-screen  justify-center items-center">
                <Toaster />
                <Card className="w-full max-w-md modelWrapper">
                    <CardHeader>
                        <CardTitle>Send Crypto</CardTitle>
                        <CardDescription>Enter the details to send your cryptocurrency.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={address}
                                readOnly
                                // onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter recipient address"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                readOnly
                                // onChange={(e) => setName(e.target.value)}
                                placeholder="Enter recipient name"
                            />
                        </div>
                        <div className="grid gap-2 selectionArea">
                            <Label htmlFor="coin">Select Coin</Label>
                            <Select onValueChange={(value) => setCoin(value as 'usdc' | 'usdt')}>
                                {/* <Select onValueChange={setCoin}> */}
                                <SelectTrigger id="coin">
                                    <SelectValue placeholder="Select coin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* <SelectItem value="eth">Ethereum (ETH)</SelectItem> */}
                                    <SelectItem value="usdc" className="selectionBox mb-1">USD Coin (USDC)</SelectItem>
                                    <SelectItem value="usdt" className="selectionBox mb-1">Tether (USDT)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2 selectionArea">
                            <Label htmlFor="network">Select Network</Label>
                            <Select onValueChange={(value) => { setNetwork(value as Network); getRpcConfig(value) }} >

                                <SelectTrigger id="network">
                                    <SelectValue placeholder="Select network" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* <SelectItem value="BASE">
                                        <div className="flex justify-between items-center w-full">
                                            <span className="text-left">Base</span>
                                            <span className="ml-auto text-right">{balances.BASE.USDC}</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="BNB">BNB {balances.BASE.USDC}</SelectItem>
                                    <SelectItem value="IOTA">IOTA {balances.BASE.USDC}</SelectItem>
                                    <SelectItem value="POLYGON">POLYGON {balances.BASE.USDC}</SelectItem> */}
                                    <SelectItem value="BASE" className="selectionBox mb-1">
                                        <div className="flex justify-between w-full flex-col">
                                            <p className="bchain text-sm">Base</p>
                                            <p className="amt text-base font-medium">{balances.BASE?.[coin.toUpperCase() as 'USDC' | 'USDT'] || 'Loading...'}</p>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="BNB" className="selectionBox mb-1">
                                        <div className="flex justify-between w-full flex-col">
                                            <p className="bchain text-sm">BNB</p>
                                            <p className="amt text-base font-medium">{balances.BNB?.[coin.toUpperCase() as 'USDC' | 'USDT'] || 'Loading...'}</p>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="IOTA" className="selectionBox mb-1">
                                        <div className="flex justify-between  w-full flex-col">
                                            <p className="bchain text-sm">IOTA</p>
                                            <p className="amt text-base font-medium">{balances.IOTA?.[coin.toUpperCase() as 'USDC' | 'USDT'] || 'Loading...'}</p>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="POLYGON" className="selectionBox mb-1">
                                        <div className="flex justify-between  w-full flex-col">
                                            <p className="bchain text-sm">POLYGON</p>
                                            <p className="amt text-base font-medium">{balances.POLYGON?.[coin.toUpperCase() as 'USDC' | 'USDT'] || 'Loading...'}</p>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount to send"
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
            {showSuccess && <SuccessModal dataResult={dataResult} />}

        </>

    );
};
export default SendTx;
