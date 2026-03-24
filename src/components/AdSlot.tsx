import React from 'react';

interface AdSlotProps {
  slot?: string;
  format?: 'banner' | 'rectangle' | 'responsive';
}

const AdSlot: React.FC<AdSlotProps> = ({ format = 'responsive' }) => {
  const heightMap = { banner: 'h-[90px]', rectangle: 'h-[250px]', responsive: 'h-[100px]' };
  return (
    <div className={`glass flex items-center justify-center ${heightMap[format]} w-full my-6 opacity-40`}>
      <span className="text-muted-foreground text-sm font-sans">Ad Space</span>
    </div>
  );
};

export default AdSlot;
