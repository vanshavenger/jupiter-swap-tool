import React from "react";
import { Asset } from "./types";
import { assets } from "./constants";

interface AssetSelectProps {
  value: string;
  onChange: (asset: Asset) => void;
  otherAsset: Asset;
  ariaLabel: string;
}

export const AssetSelect: React.FC<AssetSelectProps> = ({
  value,
  onChange,
  otherAsset,
  ariaLabel,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAsset =
      assets.find((a) => a.name === event.target.value) || assets[0];
    if (newAsset.mint === otherAsset.mint) {
      onChange(assets.find((a) => a.mint !== newAsset.mint) || assets[1]);
    } else {
      onChange(newAsset);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 rounded-r-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
      aria-label={ariaLabel}
    >
      {assets.map((asset) => (
        <option key={asset.mint} value={asset.name}>
          {asset.name}
        </option>
      ))}
    </select>
  );
};
