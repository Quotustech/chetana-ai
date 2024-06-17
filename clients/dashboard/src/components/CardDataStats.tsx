import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  total?: string;
  children?: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  
  children,
}) => {
  return (
    <div className={`rounded-sm border border-stroke flex flox-col ${!children && !total ? 'justify-center p-8' : 'justify-between py-4 '} items-center  bg-white px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark`} title={title}>
      {children && <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>}

      <div className="flex items-center justify-between flex-col">
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {total}
          </h4>
          <span className={`${!children && !total ? 'text-lg' : 'text-sm'}  font-medium`}>{title.slice(0,13)}</span>

      </div>
    </div>
  );
};

export default CardDataStats;
