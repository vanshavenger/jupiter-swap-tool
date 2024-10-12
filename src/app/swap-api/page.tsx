"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, VersionedTransaction } from "@solana/web3.js";
import { useCallback, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SwapInput } from "@/components/swap/SwapInput";
import { useDebounce } from "@/components/swap/useDebounce";
import { Asset } from "@/components/swap/types";
import { assets } from "@/components/swap/constants";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_URL as string,
  "confirmed",
);

export default function SwapPage() {
  const [fromAsset, setFromAsset] = useState<Asset>(assets[0]);
  const [toAsset, setToAsset] = useState<Asset>(assets[1]);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [quoteResponse, setQuoteResponse] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<string>("0");
  const wallet = useWallet();

  const getQuote = useCallback(
    async (currentAmount: string) => {
      if (isNaN(Number(currentAmount)) || Number(currentAmount) <= 0) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${fromAsset.mint}&outputMint=${toAsset.mint}&amount=${Math.floor(Number(currentAmount) * Math.pow(10, fromAsset.decimals))}&slippage=0.5`,
        );
        const quote = await response.json();

        if (quote && quote.outAmount) {
          const outAmountNumber =
            Number(quote.outAmount) / Math.pow(10, toAsset.decimals);
          setToAmount(outAmountNumber.toFixed(toAsset.decimals));
        }

        setQuoteResponse(quote);
        setError("");
      } catch (error) {
        setError("Failed to fetch quote. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [fromAsset.decimals, fromAsset.mint, toAsset.decimals, toAsset.mint],
  );

  const debouncedGetQuote = useDebounce(getQuote, 500);

  useEffect(() => {
    if (fromAmount && Number(fromAmount) > 0) {
      debouncedGetQuote(fromAmount);
    } else {
      setToAmount("");
      setQuoteResponse(null);
    }
  }, [fromAmount, fromAsset, toAsset, debouncedGetQuote]);

  const fetchBalance = useCallback(async () => {
    if (!wallet.publicKey) return;

    try {
      if (fromAsset.mint === "So11111111111111111111111111111111111111112") {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance((balance / 1e9).toFixed(fromAsset.decimals));
      } else {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          wallet.publicKey,
          {
            programId: TOKEN_PROGRAM_ID,
          },
        );

        const tokenAccount = tokenAccounts.value.find(
          (account) => account.account.data.parsed.info.mint === fromAsset.mint,
        );

        if (tokenAccount) {
          const balance =
            tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
          setBalance(balance.toFixed(fromAsset.decimals));
        } else {
          setBalance("0");
        }
      }
    } catch (error) {
      setBalance("0");
    }
  }, [wallet.publicKey, fromAsset.mint, fromAsset.decimals]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, wallet.publicKey, fromAsset]);

  const signAndSendTransaction = useCallback(async () => {
    if (!wallet.connected || !wallet.signTransaction) {
      setError(
        "Wallet is not connected or does not support signing transactions",
      );
      return;
    }

    if (Number(fromAmount) > Number(balance)) {
      setError("Insufficient balance for this swap");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: wallet.publicKey?.toString(),
          wrapAndUnwrapSol: true,
        }),
      });
      const { swapTransaction } = await response.json();

      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signedTransaction = await wallet.signTransaction(transaction);

      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      const latestBlockHash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid,
        },
        "confirmed",
      );
      setError("");
      fetchBalance();
    } catch (error) {
      setError("Failed to complete the swap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [quoteResponse, wallet, fromAmount, balance, fetchBalance]);

  const isSwapDisabled = useMemo(
    () =>
      toAsset.mint === fromAsset.mint ||
      !fromAmount ||
      Number(fromAmount) <= 0 ||
      Number(fromAmount) > Number(balance) ||
      !quoteResponse ||
      isLoading,
    [
      toAsset.mint,
      fromAsset.mint,
      fromAmount,
      balance,
      quoteResponse,
      isLoading,
    ],
  );

  if (wallet.connected === false) {
    return (
      <div className="flex items-center justify-center py-24">
        <WalletMultiButton />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Swap Cryptocurrencies
        </h1>
        <div className="space-y-6">
          <SwapInput
            label="You pay"
            amount={fromAmount}
            setAmount={setFromAmount}
            asset={fromAsset}
            setAsset={setFromAsset}
            otherAsset={toAsset}
            balance={balance}
          />
          <SwapInput
            label="You receive"
            amount={toAmount}
            asset={toAsset}
            setAsset={setToAsset}
            otherAsset={fromAsset}
            readOnly
          />
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm"
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.button
            onClick={signAndSendTransaction}
            className="w-full bg-indigo-600 text-white rounded-xl py-4 px-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSwapDisabled}
            aria-busy={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? "Processing..." : "Swap"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
