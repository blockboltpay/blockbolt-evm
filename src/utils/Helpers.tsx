import { default as Resolution } from '@unstoppabledomains/resolution';
import { type Chain } from 'viem';

export const sound_box_url = "https://api-fintech-terminal-management.bonrix.in/create_wav_file";
export const sound_provider_id = "CZWguXGUlhBNiG5brX2g4tPIdW0kEsO1";

export const blockboltIotaAddress = "0x023E3e69C48042EEB1892269036E96C71b138ea2"
export const blockboltBaseAddress = "0x8bDA78Cc649bfc70eDC44Ac61287ead47054f29B"
export const blockboltBnbAddress = "0x27F558a5189EC09bca25a795256Fbf2592b20000"
export const blockboltMonadAddress = "0x394bbd6F91bFe65709524730D9D1867eF7Dcd435"
export const usdtIotaAddress = "0x4C74Ee1CB3f711962458385126520381912c7b01"
export const usdtBaseAddress = "0x8208be07Fd9CFfE05cE197FbaD8F21242C2DeDe7"
export const usdtPolygonAddress = "0x4C74Ee1CB3f711962458385126520381912c7b01"
export const usdtBnbAddress = "0x8aed34e52e70e74D697cE831Eb7c4282586EEeB5"
export const usdcIotaAddress = "0xa65B3f7AE8f5d1FA8983bfd2da2799415CD26493"
export const usdcBaseAddress = "0xD9f986F5d1c37759e39E8Ed385F9c78738A2f91B"
export const usdcBnbAddress = "0xc0dEf8bDAbe0f3805d26C4F963ec75ffAd26d7d9"
export const usdcPolygonAddress = "0x27F558a5189EC09bca25a795256Fbf2592b20000"

export const rpcMainConfig = {
    BNB: {
        name: 'BNB',
        rpc: 'https://bsc-rpc.publicnode.com',
        chainId: 56,
        blockboltAddress: "0x96e9781dDF416e4B9041E6c5F310bbff8b4693B7",
        usdcAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        usdtAddress: "0x55d398326f99059fF775485246999027B3197955"
    },
    BASE: {
        name: 'BASE',
        rpc: 'https://mainnet.base.org',
        chainId: 8453,
        blockboltAddress: "0x96e9781ddf416e4b9041e6c5f310bbff8b4693b7",
        usdcAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        usdtAddress: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2"
    }
}

export const rpcTestConfig = {
    BNB: {
        name: 'BNB',
        rpc: 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
        chainId: 97,
        blockboltAddress: "0x96e9781ddf416e4b9041e6c5f310bbff8b4693b7",
        usdcAddress: "0x64544969ed7EBf5f083679233325356EbE738930",
        usdtAddress: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd"
    },
    BASE: {
        name: 'BASE',
        rpc: 'https://base-sepolia.g.alchemy.com/v2/Fb8rIgjDR9607bSeMkRk-j_KpRojLni4',
        chainId: 84532,
        blockboltAddress: "0x103aD47F7F6e6735df5Ea31b4579F9ea97126D3d",
        usdcAddress: "0x5Fa12fe9b387226210740A9e2431EeD6b5E19239",
        usdtAddress: "0xC70558e1b50492EA5B61CCc1407E2BA9c0FA5b47"
    },
}

export const rpcAllConfig = {
    BNB: {
        name: 'BNB',
        rpc: 'https://bsc-rpc.publicnode.com',
        chainId: 56,
        blockboltAddress: "0x96e9781dDF416e4B9041E6c5F310bbff8b4693B7",
        usdcAddress: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        usdtAddress: "0x55d398326f99059fF775485246999027B3197955"
    },
    BASE: {
        name: 'BASE',
        rpc: 'https://base-sepolia.g.alchemy.com/v2/Fb8rIgjDR9607bSeMkRk-j_KpRojLni4',
        chainId: 84532,
        blockboltAddress: "0x103aD47F7F6e6735df5Ea31b4579F9ea97126D3d",
        usdcAddress: "0x5Fa12fe9b387226210740A9e2431EeD6b5E19239",
        usdtAddress: "0xC70558e1b50492EA5B61CCc1407E2BA9c0FA5b47"
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
    },
    MONAD: {
        name: 'Monad Devnet',
        rpc: 'https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a',
        chainId: 20143,
        blockboltAddress: "0x394bbd6F91bFe65709524730D9D1867eF7Dcd435",
        usdcAddress: usdcPolygonAddress,
        usdtAddress: usdtPolygonAddress
    }
};

const EVM_Config_Test = {
    BNB: {
        USDC: "0x64544969ed7EBf5f083679233325356EbE738930",
        USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
        BlockBolt: "0x96e9781ddf416e4b9041e6c5f310bbff8b4693b7",
    },
    BASE: {
        USDC: "0x5Fa12fe9b387226210740A9e2431EeD6b5E19239",
        USDT: "0xC70558e1b50492EA5B61CCc1407E2BA9c0FA5b47",
        BlockBolt: "0x103aD47F7F6e6735df5Ea31b4579F9ea97126D3d",
    },
}

const EVM_Config_Main = {
    BNB: {
        USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        USDT: "0x55d398326f99059fF775485246999027B3197955",
        BlockBolt: "0x96e9781dDF416e4B9041E6c5F310bbff8b4693B7",
    },
    BASE: {
        USDC: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        USDT: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
        BlockBolt: "0x96e9781ddf416e4b9041e6c5f310bbff8b4693b7",
    },
}

export const renderTokenTestAddress = (coin_name: any) => {
    switch (coin_name) {
        case "BNB-USDT":
            return EVM_Config_Test.BNB.USDT;
        case "BNB-USDC":
            return EVM_Config_Test.BNB.USDC;
        case "BNB":
            return "";
        case "BASE-USDT":
            return EVM_Config_Test.BASE.USDT;
        case "BASE-USDC":
            return EVM_Config_Test.BASE.USDC;
        case "ETH":
            return "";
    }
}

export const renderTokenMainAddress = (coin_name: any) => {
    switch (coin_name) {
        case "BNB-USDT":
            return EVM_Config_Main.BNB.USDT;
        case "BNB-USDC":
            return EVM_Config_Main.BNB.USDC;
        case "BNB":
            return "";
        case "BASE-USDT":
            return EVM_Config_Main.BASE.USDT;
        case "BASE-USDC":
            return EVM_Config_Main.BASE.USDC;
        case "ETH":
            return "";
    }
}

export const renderContractTestAddress = (chain_name: any) => {
    switch (chain_name) {
        case "Binance":
            return EVM_Config_Test.BNB.BlockBolt;
        case "BASE":
            return EVM_Config_Test.BASE.BlockBolt;
    }
}

export const renderContractMainAddress = (chain_name: any) => {
    switch (chain_name) {
        case "Binance":
            return EVM_Config_Main.BNB.BlockBolt;
        case "BASE":
            return EVM_Config_Main.BASE.BlockBolt;
    }
}

type Network = 'BASE' | 'BNB' | 'IOTA' | 'POLYGON' | 'MONAD';

interface ChainConfig {
    name: string;
    rpc: string;
    chainId: number;
    blockboltAddress: string;
    usdcAddress: string;
    usdtAddress: string;
}

// RPC Configurations
export const rpcConfig: Record<Network, ChainConfig> = {
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
        rpc: 'https://rpc.ankr.com/bsc/9d1d2b1a77c22093e7299f68f6433c04a8c628bf19a053696bb593f333807823',
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
        usdcAddress: usdcIotaAddress,
        usdtAddress: usdtIotaAddress
    },
    MONAD: {
        name: 'Monad Devnet',
        rpc: 'https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a',
        chainId: 20143,
        blockboltAddress: blockboltMonadAddress,
        usdcAddress: usdcPolygonAddress,
        usdtAddress: usdtPolygonAddress
    }
};

export const getRpcConfig = (chain: any, setJsonContent: any) => {
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
        case 'MONAD':
            config = rpcConfig.MONAD;
            break;
        default:
            throw new Error('Unsupported chain');
    }
    setJsonContent(config);
};

export const coin = [
    {
        chain: 'IOTA',
        usdcAddress: usdcIotaAddress,
        usdtAddress: usdtIotaAddress,
    },
    {
        chain: 'BNB',
        usdcAddress: usdcBnbAddress,
        usdtAddress: usdcBnbAddress,
    },
    {
        chain: "BASE",
        usdcAddress: usdcBaseAddress,
        usdtAddress: usdcBaseAddress,
    },
    {
        chain: "POLYGON",
        usdcAddress: usdcPolygonAddress,
        usdtAddress: usdcPolygonAddress,
    },
]

export const resolution = new Resolution({
    sourceConfig: {
        uns: {
            locations: {
                Layer1: {
                    url: 'https://eth-mainnet.g.alchemy.com/v2/g4tvi-8_ahuCEs7GrqiQUdgVuJCEpqiG',
                    network: 'mainnet',
                },
                Layer2: {
                    url: 'https://polygon-mainnet.g.alchemy.com/v2/YfpKo6qpJL1mmqDnxe-ZiT5bqr0meEjV',
                    network: 'polygon-mainnet',
                },
            },
        },
        zns: {
            url: 'https://api.zilliqa.com',
            network: 'mainnet',
        },
    },
});

export const checkExplorer = (getChainName: any, txid: any) => {
    switch (getChainName) {
        case "BASE": {
            return `https://sepolia.basescan.org/tx/${txid}`;
        }
        case "BNB": {
            return `https://bscscan.com/tx/${txid}`;
        }
        case "Binance": {
            return `https://bscscan.com/tx/${txid}`;
        }
        case "IOTA": {
            return `https://explorer.evm.testnet.iotaledger.net/tx/${txid}`;
        }
        case "POLYGON": {
            return `https://amoy.polygonscan.com/tx/${txid}`;
        }
        case "Monad": {
            return `https://explorer.monad-devnet.devnet101.com/tx/${txid}`
        }
    }
};

export function shorten(
    text: string,
    start = 5,
    end = 3,
    separator = "..."
): string {
    return !text
        ? ""
        : text.slice(0, start) + separator + (end ? text.slice(-end) : "");
}

export function encrypted_data(string: string) {
    string = unescape(encodeURIComponent(string));
    var newString = "",
        char,
        nextChar,
        combinedCharCode;
    for (var i = 0; i < string.length; i += 2) {
        char = string.charCodeAt(i);

        if (i + 1 < string.length) {
            nextChar = string.charCodeAt(i + 1) - 31;

            combinedCharCode =
                char +
                "" +
                nextChar.toLocaleString("en", {
                    minimumIntegerDigits: 2,
                });

            newString += String.fromCharCode(parseInt(combinedCharCode, 10));
        } else {
            newString += string.charAt(i);
        }
    }
    return newString;
}

export function decrypted_data(string: string) {
    var newString = "",
        char,
        codeStr,
        firstCharCode,
        lastCharCode;
    if (string && string.length > 1) {
        for (var i = 0; i < string.length; i++) {
            char = string.charCodeAt(i);
            if (char > 132) {
                codeStr = char.toString(10);

                firstCharCode = parseInt(codeStr.substring(0, codeStr.length - 2), 10);

                lastCharCode =
                    parseInt(codeStr.substring(codeStr.length - 2, codeStr.length), 10) +
                    31;

                newString +=
                    String.fromCharCode(firstCharCode) +
                    String.fromCharCode(lastCharCode);
            } else {
                newString += string.charAt(i);
            }
        }
    }
    return newString;
}

export const bscTestnetCustom = {
    id: 97,
    name: 'BSC Testnet',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://bsc-rpc.publicnode.com'] },
    },
    blockExplorers: {
        default: {
            name: 'BscScan',
            url: 'https://bscscan.com',
            apiUrl: 'https://bscscan.com/api',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 17422483,
        },
    },
    testnet: false,
} as const satisfies Chain
