"use client"
import { useEffect, useState } from 'react';
import CopyIcon from "@/components/Icons/CopyIcon";
import MenuIcon from "@/components/Icons/MenuIcon";
import RefreshCwIcon from "@/components/Icons//RefreshCwIcon";
import ScanIcon from "@/components/Icons/ScanIcon";
import SendIcon from "@/components/Icons/SendIcon";
import SwitchCameraIcon from "@/components/Icons/SwitchCameraIcon";
import { Button } from "@/components/ui/button"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import MountainIcon from '../Icons/MountainIcon';

import { validateMnemonic as bip39ValidateMnemonic } from "@scure/bip39";
import { english, generateMnemonic } from 'viem/accounts'
import toast, { Toaster } from "react-hot-toast";
import { JsonRpcProvider, ethers } from "ethers";
import { encrypted_data } from '@/utils/Helpers';
import { wordlist } from "@scure/bip39/wordlists/english";
// import { useRouter } from 'next/router';




export default function WalletSetup() {
    const [selectedOption, setSelectedOption] = useState<'create' | 'import' | null>(null);
    const [mnemonic, setMnemonic] = useState<string>('');
    const [importWords, setImportWords] = useState<string>('');
    // const router = useRouter();

    useEffect(() => {
        if (selectedOption === 'create') {
            setMnemonic(generateMnemonic(english));
        }
    }, [selectedOption]);

    const handleCreateWallet = () => {
        setSelectedOption('create');
    };

    const handleImportWallet = () => {
        setSelectedOption('import');
    };

    const handleCopySeedPhrase = () => {
        navigator.clipboard.writeText(mnemonic);
        toast.success('Seed phrase copied to clipboard!');
    };

    const handleRedirectToHome = () => {
        // Redirect to home page or the Component
        window.location.href = '/'; // or use router.push('/component') if using Next.js router
    };

    const createWallet = async () => {
        if (mnemonic) {
            const wallet = ethers.Wallet.fromPhrase(mnemonic);
            console.log(wallet);

            if (wallet && bip39ValidateMnemonic(mnemonic, wordlist)) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('wallet:mnemonic', encrypted_data(mnemonic));
                    localStorage.setItem('wallet:gin', 'no');
                    localStorage.setItem('network:name', 'testnet');
                    localStorage.setItem('chain:name', 'BASE');
                    localStorage.setItem(
                        'network:url',
                        'https://base-sepolia.g.alchemy.com/v2/Fb8rIgjDR9607bSeMkRk-j_KpRojLni4'
                    );
                }
                toast.success('Wallet created successfully');
                handleRedirectToHome();
            } else {
                toast.error('Invalid mnemonic phrase');
            }
        } else {
            toast.error('Something went wrong');
        }
    };

    const importWallet = () => {
        if (importWords) {
            const mnemonic = importWords.trim().toLowerCase();
            if (bip39ValidateMnemonic(mnemonic, wordlist)) {
                if (typeof window !== 'undefined') {

                    localStorage.setItem('wallet:mnemonic', encrypted_data(mnemonic));
                    localStorage.setItem('wallet:gin', 'no');
                    toast.success('Wallet imported successfully');
                    handleRedirectToHome();
                }
            } else {
                toast.error('Invalid mnemonic phrase');
            }
        } else {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950 w-full">
            <Toaster />
            <div className="mx-auto w-full max-w-md space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <MountainIcon className="h-10 w-10" />
                    <h1 className="text-2xl font-bold">Wallet Setup</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-center">Set up your secure cryptocurrency wallet.</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <button
                                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:focus:ring-gray-300 ${selectedOption === 'create'
                                    ? 'bg-gray-900 text-white hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80'
                                    : 'bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                onClick={handleCreateWallet}
                            >
                                Create Wallet
                            </button>
                            <button
                                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:focus:ring-gray-300 ${selectedOption === 'import'
                                    ? 'bg-gray-900 text-white hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80'
                                    : 'bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                onClick={handleImportWallet}
                            >
                                Import Wallet
                            </button>
                        </div>
                        {selectedOption === 'create' && (
                            <div className="space-y-4">
                                <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Your Seed Phrase</p>
                                        <Button variant="outline" size="icon" className="ml-auto" onClick={handleCopySeedPhrase}>
                                            <CopyIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Input value={mnemonic} readOnly className="mt-2" />
                                </div>
                                <Button className="w-full" onClick={createWallet}>
                                    Next
                                </Button>
                            </div>
                        )}
                        {selectedOption === 'import' && (
                            <div className="space-y-4">
                                <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                                    <Label htmlFor="seed-phrase">Seed Phrase</Label>
                                    <Textarea
                                        id="seed-phrase"
                                        placeholder="Enter your seed phrase"
                                        value={importWords}
                                        onChange={(e) => setImportWords(e.target.value)}
                                        className="mt-2"
                                    />
                                </div>
                                <Button className="w-full" onClick={importWallet}>
                                    Import Wallet
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}



