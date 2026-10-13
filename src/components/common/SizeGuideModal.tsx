import React, { useState } from 'react';
import { ProductSize } from '../../types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: ProductSize) => void;
  selectedSize?: ProductSize;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectSize,
  selectedSize = 'L',
}) => {
  const [userHeight, setUserHeight] = useState<number>(180); // cm
  const [userWeight, setUserWeight] = useState<number>(75); // kg
  const [preferredFit, setPreferredFit] = useState<'regular' | 'oversized'>('oversized');

  if (!isOpen) return null;

  // Smart fit calculator logic based on Indian streetwear measurements
  const recommendSize = (): ProductSize => {
    if (preferredFit === 'regular') {
      if (userWeight < 65) return 'S';
      if (userWeight < 75) return 'M';
      if (userWeight < 85) return 'L';
      if (userWeight < 95) return 'XL';
      return 'XXL';
    } else {
      if (userWeight < 60) return 'S';
      if (userWeight < 70) return 'M';
      if (userWeight < 82) return 'L';
      if (userWeight < 94) return 'XL';
      return 'XXL';
    }
  };

  const recommended = recommendSize();

  const handleApplyRecommended = () => {
    if (onSelectSize) {
      onSelectSize(recommended);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-xl shadow-2xl border border-[#e5e0d8] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between bg-[#fbf9f6] border-b border-[#e5e0d8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#111111] text-[22px]">straighten</span>
            <h3 className="font-display font-bold text-base text-[#111111] uppercase tracking-tight">
              Size Chart &amp; 360° Fit Guide
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#eae8e5] text-[#5f615e] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
          {/* Streetwear Fit Notice */}
          <div className="bg-[#dce6cd] p-3.5 rounded-lg flex items-start gap-2.5 text-xs text-[#414a37]">
            <span className="material-symbols-outlined text-[#58614e] text-[20px] shrink-0 mt-0.5">
              tips_and_updates
            </span>
            <p className="leading-relaxed">
              <strong>Streetwear Fit Notice:</strong> This garment is intentionally engineered with a wide 3-inch drop-shoulder and 2-inch additional chest circumference. If you desire a regular fitted look, order <strong>1 size smaller</strong> than your standard mall tee size.
            </p>
          </div>

          {/* Interactive 3D Size Finder Tool */}
          <div className="bg-[#f5f3f0] p-4 rounded-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                Interactive 3D Fit Calculator
              </span>
              <span className="text-[11px] bg-[#111111] text-white px-2 py-0.5 rounded font-bold">
                Recommended: Size {recommended}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-[#5f615e] font-medium mb-1">
                  Height: <strong>{userHeight} cm</strong>
                </label>
                <input
                  type="range"
                  min="155"
                  max="205"
                  value={userHeight}
                  onChange={(e) => setUserHeight(Number(e.target.value))}
                  className="w-full accent-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#5f615e] font-medium mb-1">
                  Weight: <strong>{userWeight} kg</strong>
                </label>
                <input
                  type="range"
                  min="45"
                  max="120"
                  value={userWeight}
                  onChange={(e) => setUserWeight(Number(e.target.value))}
                  className="w-full accent-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#5f615e] font-medium mb-1">
                  Fit Preference
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setPreferredFit('oversized')}
                    className={`flex-1 py-1 text-[11px] rounded font-semibold transition-colors ${
                      preferredFit === 'oversized'
                        ? 'bg-[#111111] text-white'
                        : 'bg-white text-[#5f615e] border border-[#e5e0d8]'
                    }`}
                  >
                    Street Oversized
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredFit('regular')}
                    className={`flex-1 py-1 text-[11px] rounded font-semibold transition-colors ${
                      preferredFit === 'regular'
                        ? 'bg-[#111111] text-white'
                        : 'bg-white text-[#5f615e] border border-[#e5e0d8]'
                    }`}
                  >
                    True to Size
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleApplyRecommended}
              className="mt-1 self-end bg-[#58614e] text-white hover:bg-[#414a37] text-xs font-bold px-3 py-1.5 rounded transition-colors"
            >
              Select Size {recommended}
            </button>
          </div>

          {/* Detailed Measurement Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#efeeeb] font-bold text-[11px] uppercase tracking-wider text-[#111111]">
                <tr>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest (Inches)</th>
                  <th className="py-2.5 px-3">Length (Inches)</th>
                  <th className="py-2.5 px-3">Shoulder (Inches)</th>
                  <th className="py-2.5 px-3">Sleeve Length</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efeeeb] text-[#1b1c1a]">
                {[
                  { size: 'S', chest: '42"', length: '28.5"', shoulder: '21.5"', sleeve: '8.5"' },
                  { size: 'M', chest: '44"', length: '29.5"', shoulder: '22.5"', sleeve: '9.0"' },
                  { size: 'L', chest: '46"', length: '30.5"', shoulder: '23.5"', sleeve: '9.5"', note: `(Model's Fit)` },
                  { size: 'XL', chest: '48"', length: '31.5"', shoulder: '24.5"', sleeve: '10.0"' },
                  { size: 'XXL', chest: '50"', length: '32.0"', shoulder: '25.5"', sleeve: '10.5"' },
                ].map((row) => (
                  <tr
                    key={row.size}
                    className={`hover:bg-[#f5f3f0] transition-colors ${
                      row.size === selectedSize ? 'bg-[#f5f3f0] font-bold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-[#111111]">
                      {row.size} {row.note && <span className="text-[10px] text-[#58614e] font-semibold">{row.note}</span>}
                    </td>
                    <td className="py-2.5 px-3 tabular-nums">{row.chest}</td>
                    <td className="py-2.5 px-3 tabular-nums">{row.length}</td>
                    <td className="py-2.5 px-3 tabular-nums">{row.shoulder}</td>
                    <td className="py-2.5 px-3 tabular-nums">{row.sleeve}</td>
                    <td className="py-2.5 px-3 text-right">
                      {onSelectSize && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSize(row.size as ProductSize);
                            onClose();
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                            row.size === selectedSize
                              ? 'bg-[#111111] text-white'
                              : 'bg-[#efeeeb] hover:bg-[#111111] hover:text-white text-[#111111]'
                          }`}
                        >
                          {row.size === selectedSize ? 'Selected' : 'Choose'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Model reference note */}
          <div className="flex items-center gap-2 text-xs text-[#5f615e] bg-[#fbf9f6] p-3 rounded border border-[#e5e0d8]">
            <span className="material-symbols-outlined text-[18px] text-[#58614e]">info</span>
            <span>
              Model in hero &amp; studio photography is <strong>6'1" (185 cm)</strong> tall, weighing 78 kg, wearing size <strong>Large</strong> for a relaxed street drape.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5e0d8]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded bg-[#111111] text-white font-bold text-xs uppercase hover:bg-[#262626] transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
