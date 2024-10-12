import React from "react";
import { motion } from "framer-motion";
import { Asset } from "./types";
import { AssetSelect } from "./AssetSelect";

interface SwapInputProps {
  label: string;
  amount: string;
  setAmount?: (value: string) => void;
  asset: Asset;
  setAsset: (asset: Asset) => void;
  otherAsset: Asset;
  balance?: string;
  readOnly?: boolean;
}

export const SwapInput: React.FC<SwapInputProps> = ({
  label,
  amount,
  setAmount,
  asset,
  setAsset,
  otherAsset,
  balance,
  readOnly = false,
}) => {
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount && setAmount(value);
    }
  };

  return (
    <motion.div layout>
      <label
        htmlFor={`${label.toLowerCase().replace(" ", "-")}-amount`}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={`${label.toLowerCase().replace(" ", "-")}-amount`}
          value={amount}
          onChange={handleAmountChange}
          className="block w-full px-4 py-3 pr-24 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-900 bg-gray-50"
          placeholder="0.00"
          aria-label={`Amount to ${label.toLowerCase()}`}
          readOnly={readOnly}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <AssetSelect
            value={asset.name}
            onChange={(newAsset) => setAsset(newAsset)}
            otherAsset={otherAsset}
            ariaLabel={`Asset to ${label.toLowerCase()}`}
          />
        </div>
      </div>
      {balance && (
        <p className="mt-1 text-sm text-gray-500">
          Balance: {balance} {asset.name}
        </p>
      )}
    </motion.div>
  );
};
