import React from 'react';

interface AnnouncementBarProps {
  text?: string;
  subtext?: string;
  active?: boolean;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  text = 'Free shipping across India on orders above ₹999',
  subtext = 'All prints handcrafted 240 GSM organic French Terry',
  active = true,
}) => {
  if (!active) return null;

  return (
    <aside className="w-full bg-[#000000] text-[#ffffff] py-2 px-3 sm:px-6 text-center select-none">
      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-[11px]">
          {text}
        </span>
        {subtext && (
          <>
            <span className="text-[#858383] hidden sm:inline">•</span>
            <span className="font-semibold uppercase tracking-wider text-[#e4e2df] text-[11px] hidden sm:inline">
              {subtext}
            </span>
          </>
        )}
      </div>
    </aside>
  );
};
