import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import CopyIcon from "@/components/Icons/CopyIcon";
import LogoutIcon from "@/components/Icons/LogoutIcon";
import RefreshCwIcon from "@/components/Icons//RefreshCwIcon";
import DropdownIcon from "@/components/Icons//DropdownIcon";
import ScanIcon from "@/components/Icons/ScanIcon";
import SendIcon from "@/components/Icons/SendIcon";
import BbMono from "@/components/Icons/BbMono";
import {
    decrypted_data,
    shorten,
    usdcBaseAddress,
    usdcBnbAddress,
    usdcIotaAddress,
    bscTestnetCustom
} from "@/utils/Helpers";
import { createPublicClient, formatEther, http } from "viem";
import { baseSepolia, bscTestnet, polygonAmoy, shimmerTestnet } from "viem/chains";
import { ethers, JsonRpcProvider } from "ethers";
import { createConfig } from '@wagmi/core'
import { getBalance } from '@wagmi/core'
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { usdtABI } from "@/utils/abi"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { UsdtIcon } from "../Icons/Usdt";
import { SolanaUsdcIcon } from "../Icons/Usdc";
import QrScan from "./QrReader";
import "../../app/globals.css";

export default function Dashboard() {
    const [coinValue, setCoinValue] = useState("");
    const [coinSymbol, setCoinSymbol] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [showNavigation, setShowNavigation] = useState(false);
    const [isTxnSuccess, setIsTxnSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [keyPair, setKeyPair] = useState({});
    const [jsonContent, setJsonContent] = useState<any>({});
    const [walletAddress, setWalletAddress] = useState("");
    const [walletNetwork, setWalletNetwork] = useState("");
    const [walletNetworkUrl, setWalletNetworkUrl] = useState("");
    const [walletNetworkChain, setWalletNetworkChain] = useState("");
    const [usdcBal, setUsdcBal] = useState("0");
    const [usdtBal, setUsdtBal] = useState("0");
    const [position, setPosition] = useState("bottom")
    const router = useRouter();

    const getNetwork = localStorage.getItem("network:name");
    const getNetworkChain = localStorage.getItem("chain:name");
    const getNetworkUrl = localStorage.getItem("network:url");
    const getMnemonic = localStorage.getItem("wallet:mnemonic");

    const keys = shorten(walletAddress && walletAddress);

    let contractAddr: string;
    switch (getNetworkChain) {
        case 'BNB':
            contractAddr = usdcBnbAddress;
            // contractAddr = usdtBnbAddress;
            break;
        case 'BASE':
            contractAddr = usdcBaseAddress;
            // contractAddr = usdtBaseAddress;
            break;
        case 'BNB':
            contractAddr = usdcIotaAddress;
            // contractAddr = usdtIotaAddress;
            break;
        case "Monad":
            break;
        default:
            break;
    }

    const getTokenBalance = async (tokenAddress: string, label: any) => {
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

    const tokenBal = async () => {
        if (jsonContent && Object.keys(jsonContent).length > 0 && getNetwork !== "devnet") {
            const usdcAddress = jsonContent?.usdcAddress;
            const usdtAddress = jsonContent?.usdtAddress;
            if (!usdcAddress || !usdtAddress) {
                console.error('USDC or USDT address is undefined');
                return;
            }
            const usdcBalance = await getTokenBalance(usdcAddress, 'USDC');
            setUsdcBal(usdcBalance as string);
            const usdtBalance = await getTokenBalance(usdtAddress, 'USDT');
            setUsdtBal(usdtBalance as string);
        }
    };

    let selectedChain: any;
    switch (getNetworkChain) {
        case "BASE":
            selectedChain = baseSepolia;
            break;
        case "IOTA":
            selectedChain = shimmerTestnet;
            break;
        case "BNB":
            selectedChain = bscTestnetCustom;
            break;
        case "POLYGON":
            selectedChain = polygonAmoy;
            break;
        case "Monad":
            break;
        default:
            console.error("Invalid network chain!");
            break;
    }

    const fetchBalance = async (publicKey: string) => {
        const publicClient = createPublicClient({
            chain: bscTestnet,
            transport: http(),
        })
        const config = createConfig({
            chains: [baseSepolia, shimmerTestnet, polygonAmoy, bscTestnetCustom],
            transports: {
                [baseSepolia.id]: http(),
                [shimmerTestnet.id]: http(),
                [bscTestnetCustom.id]: http(),
                [polygonAmoy.id]: http(),
            },
        })
        try {
            const balance = await getBalance(config, {
                address: publicKey as `0x${string}`,
                chainId: selectedChain.id
            });
            const formatBalance = formatEther(balance.value);
            const numericBalance = parseFloat(formatBalance);
            const formattedBalance = numericBalance.toFixed(5);
            setCoinValue(formattedBalance);
            setCoinSymbol(balance.symbol)
            setBalanceLoading(false);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const providerRPC = {
        BaseSepolia: {
            name: 'Base Sepolia',
            rpc: 'https://sepolia.base.org',
            chainId: 84532,
        },
    };

    const Defaultprovider = new JsonRpcProvider(providerRPC.BaseSepolia.rpc, {
        chainId: providerRPC.BaseSepolia.chainId,
        name: providerRPC.BaseSepolia.name,
    });

    const fetchData = (walletAddress: any) => {
        setLoading(true);
        fetchBalance(walletAddress);
        setLoading(false);
    };

    const getDataKeyPair = async () => {
        const TEST_MNEMONICS = decrypted_data(getMnemonic!);
        const walletMnemonic = ethers.Wallet.fromPhrase(TEST_MNEMONICS)
        const walletKey = await walletMnemonic.getAddress()
        const signer = walletMnemonic.connect(Defaultprovider)
        setKeyPair(signer);
        getNetwork !== "devnet" && setWalletAddress(walletKey);
        getNetwork !== "devnet" && fetchData(walletKey);
    };

    const logoutData = async () => {
        localStorage.clear();
        router.push("/")
    }

    const onCopyText = () => {
        navigator.clipboard.writeText(walletAddress);
        toast('Copied!');
    };

    const baseConfig = async () => {
        setWalletNetwork("testnet");
        setWalletNetworkUrl("https://base-sepolia.g.alchemy.com/v2/Fb8rIgjDR9607bSeMkRk-j_KpRojLni4");
        if (typeof window !== 'undefined') {
            localStorage.setItem("network:name", "testnet");
            localStorage.setItem("chain:name", "BASE");
            localStorage.setItem("network:url", "https://base-sepolia.g.alchemy.com/v2/Fb8rIgjDR9607bSeMkRk-j_KpRojLni4");
        }
        toast('Switched to BASE',
            {
                icon: '🔵',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );
        setShowNavigation(false);
    }

    const bnbConfig = async () => {
        setWalletNetwork("testnet");
        setWalletNetworkUrl("https://bsc-rpc.publicnode.com");
        if (typeof window !== 'undefined') {
            localStorage.setItem("network:name", "testnet");
            localStorage.setItem("chain:name", "BNB");
            localStorage.setItem("network:url", "https://bsc-rpc.publicnode.com");
        }
        toast('Switched to BNB',
            {
                icon: '🟠',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );
        setShowNavigation(false);
    }

    const iotaConfig = async () => {
        setWalletNetwork("testnet");
        setWalletNetworkUrl("https://json-rpc.evm.testnet.iotaledger.net");
        if (typeof window !== 'undefined') {
            localStorage.setItem("network:name", "testnet");
            localStorage.setItem("chain:name", "IOTA");
            localStorage.setItem("network:url", "https://json-rpc.evm.testnet.iotaledger.net");
        }
        toast('Switched to IOTA',
            {
                icon: '⚫️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );
        setShowNavigation(false);
    }

    const polygonConfig = async () => {
        setWalletNetwork("testnet");
        setWalletNetworkUrl("https://rpc-amoy.polygon.technology");
        if (typeof window !== 'undefined') {
            localStorage.setItem("network:name", "testnet");
            localStorage.setItem("chain:name", "POLYGON");
            localStorage.setItem("network:url", "https://rpc-amoy.polygon.technology");
        }
        toast('Switched to POLYGON',
            {
                icon: '🟣',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );
        setShowNavigation(false);
    }

    const monadConfig = async () => {
        setWalletNetwork("devnet");
        setWalletNetworkUrl("https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a");
        if (typeof window !== 'undefined') {
            localStorage.setItem("network:name", "devnet");
            localStorage.setItem("chain:name", "Monad");
            localStorage.setItem("network:url", "https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a");
        }
        toast('Switched to Monad',
            {
                icon: '🟣',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );
        setShowNavigation(false);
    }

    useEffect(() => {
        if (walletAddress !== "" && getNetwork !== "devnet" && isTxnSuccess) {
            fetchData(walletAddress);
            setIsTxnSuccess(false);
        }
    }, [isTxnSuccess]);

    useEffect(() => {
        getNetworkChain !== "devnet" && tokenBal();
    }, [getNetworkChain, jsonContent]);

    useEffect(() => {
        if (
            getNetwork !== "" &&
            getNetwork !== null &&
            getNetwork !== undefined &&
            getNetworkUrl !== "" &&
            getNetworkUrl !== null &&
            getNetworkUrl !== undefined &&
            getNetworkChain !== "" &&
            getNetworkChain !== null &&
            getNetworkChain !== undefined &&
            getNetworkChain !== "devnet"
        ) {
            setWalletNetwork(decrypted_data(getNetwork));
            setWalletNetworkUrl(decrypted_data(getNetworkUrl));
            setWalletNetworkChain(decrypted_data(getNetworkChain));
        }

        if (window.location.hash !== "") { router.replace("/",); }

        if (
            getMnemonic !== "" &&
            getMnemonic !== null &&
            getMnemonic !== undefined
        ) { getDataKeyPair(); }

    }, [getNetworkChain]);

    useEffect(() => {
        getDataKeyPair()
    }, [walletNetworkUrl])

    useEffect(() => {
        const defaultNetwork = localStorage.getItem("chain:name") || 'BASE';
        if (defaultNetwork === 'BASE') setPosition('base');
        if (defaultNetwork === 'BNB') setPosition('bnb');
        if (defaultNetwork === 'IOTA') setPosition('iota');
        if (defaultNetwork === 'POLYGON') setPosition('polygon');
        if (defaultNetwork === 'Monad') setPosition('monad');
    }, []);

    const handleChange = async (value: string) => {
        setPosition(value);
        if (value === 'base') await baseConfig();
        if (value === 'bnb') await bnbConfig();
        if (value === 'iota') await iotaConfig();
        if (value === 'polygon') await polygonConfig();
        if (value === 'monad') await monadConfig();
    };

    return (
        <>
            <Toaster />
            {showScanner ? <QrScan /> :
                <div className="flex flex-col h-screen w-full">
                    <header className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">

                        <Button variant="ghost" size="icon">
                            <BbMono />
                            <span className="sr-only">Open menu</span>
                        </Button>
                        <div className="text-base font-medium bg-grey leading-none">EVM Demo Wallet</div>
                        <Button variant="ghost" size="icon" onClick={logoutData} className="logoutIcon">
                            <LogoutIcon className="h-6 w-6" />
                            <span className="sr-only">LogOut</span>
                        </Button>
                    </header>
                    <div className="flex-1 overflow-auto">
                        <div className="flex items-center justify-center py-6 bg-gray-900 text-black">
                            <Button variant="outline" className="px-4 py-2 rounded-full" onClick={() => setShowScanner(true)}>
                                <ScanIcon className="h-4 w-4 mr-2" />
                                Scan
                            </Button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center space-x-2 bg-slate-200 py-1 px-2 rounded-md">
                                    <span className="text-gray-500 text-sm">Wallet Address</span>
                                    <div className="flex items-center">
                                        <span className="font-medium text-sm">{keys}</span>
                                    </div>
                                    <CopyIcon onClick={onCopyText} className="h-3 w-3" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-gray-500 text-sm flex items-center gap-2">Balance<RefreshCwIcon className="h-3 w-3" /></span>
                                {getNetwork == "devnet" ? (
                                    <span className="font-medium text-2xl">0.0000 MON</span>
                                ) : (
                                    <span className="font-medium text-2xl">{coinValue} {coinSymbol}</span>
                                )}
                            </div>
                            <div className="flex items-center justify-center  gap-4">
                                <Button variant="outline" className="px-4 py-2 rounded-full" onClick={tokenBal}>
                                    <SendIcon className="h-4 w-4 mr-2" />
                                    SEND
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="px-2 py-2 rounded-md bg-transparent flex gap-2">
                                            {getNetworkChain}<DropdownIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel>Select Chain</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup value={position} onValueChange={handleChange}>
                                            <DropdownMenuRadioItem value="base">BASE</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="iota">IOTA</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="bnb">BNB</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="polygon">POLYGON</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="monad">MONAD</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <ScrollArea className="flex-1">
                            {getNetwork == "devnet" ? (
                                <div className="p-4 space-y-4">
                                    <Card className="bg-gray-50 dark:bg-gray-900 dark:text-white">
                                        <CardContent className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">DMON</h4>
                                                <p className="text-gray-500 dark:text-green-300">DMON</p>
                                            </div>
                                            <div className="text-right">
                                                <h4 className="font-medium">0 DMON</h4>
                                                <p className="text-gray-500 dark:text-green-300">$1</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : (
                                <div className="p-4 space-y-4">
                                    <Card className="bg-gray-50 dark:bg-gray-900 dark:text-white">
                                        <CardContent className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <UsdtIcon />
                                                <div>
                                                    <h4 className="font-medium">USDT</h4>
                                                    <p className="text-gray-500 dark:text-green-300">USDT</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <h4 className="font-medium">{usdtBal} USDT</h4>
                                                <p className="text-gray-500 dark:text-green-300">$1</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gray-50 dark:bg-gray-900 dark:text-white">
                                        <CardContent className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <SolanaUsdcIcon />
                                                <div>
                                                    <h4 className="font-medium">USDC</h4>
                                                    <p className="text-gray-500 dark:text-green-300">USDC</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <h4 className="font-medium">{usdcBal} USDC</h4>
                                                <p className="text-gray-500 dark:text-green-300">$1</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            }
        </>
    );
}
