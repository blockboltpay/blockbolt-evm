import { useEffect, useState } from "react"
import copy from "copy-to-clipboard"
import Link from "next/link"
import { checkExplorer, shorten } from "@/utils/Helpers"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CheckIcon from "@/components/Icons/CheckIcon"
import CopyIcon from "@/components/Icons/CopyIcon"

const SuccessModal = ({ dataResult, handleCloseScanner, isOpen }: any) => {
    const [first, setfirst] = useState('');

    const copyContent = (textToCopy: string) => {
        copy(textToCopy, {
            debug: true,
            message: "Press #{key} to copy",
        });
    };

    useEffect(() => {
        try {
            const txIddata = checkExplorer(dataResult.chainName, dataResult.transactionId);
            setfirst(txIddata as string);
        } catch (error) {
            console.log(error);
        }
    }, [dataResult]);

    return (
        <Dialog open={isOpen} onOpenChange={handleCloseScanner}>
            <DialogContent className="sm:max-w-[480px] successWrapper">
                <div className="flex flex-col items-center gap-6 sm:p-8 ">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                        <CheckIcon className="h-9 w-9 text-green-500" />
                    </div>
                    <div className="space-y-2 text-center">
                        <h3 className="text-2xl font-semibold">Transaction Successful</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Your transaction has been processed and is now visible on the blockchain.
                        </p>
                    </div>
                    <div className="grid w-full gap-4">
                        <div className="flex justify-between items-center gap-4">
                            <p className="text-gray-500 dark:text-gray-400">Amount</p>
                            <p className="font-medium">{dataResult.amount} {dataResult.coin}</p>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <p className="text-gray-500 dark:text-gray-400">Recipient</p>
                            <p className="font-medium">{shorten(dataResult.recipientAddress)}</p>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <p className="text-gray-500 dark:text-gray-400">Transaction ID</p>
                            <div className="flex items-center gap-2">
                                <p className="font-medium">{shorten(dataResult.transactionId)}</p>
                                <Button variant="ghost" size="icon">
                                    <span onClick={() => copyContent(dataResult.transactionId)}><CopyIcon className="h-4 w-4" /></span>
                                    <span className="sr-only">Copy transaction ID</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    {first !== "" && (
                        <Link
                            href={first}
                            rel="noopener noreferrer"
                            target="_blank"
                            className="w-full"
                            prefetch={false}
                        >
                            <Button className="w-full">View on Blockchain Explorer</Button>
                        </Link>
                    )}
                </div>
            </DialogContent>
        </Dialog >
    )
}



export default SuccessModal