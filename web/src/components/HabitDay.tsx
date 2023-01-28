import * as Popover from '@radix-ui/react-popover';

import dayjs from 'dayjs';
import clsx from 'clsx';

import { ProgressBar } from './ProgressBar';
import { HabitList } from './HabitList';
import { useState } from 'react';


interface habitDayProps{
    date: Date;
    amount?: number;
    defaultCompleted?: number;
}

export function HabitDay({amount = 0, defaultCompleted = 0, date} : habitDayProps) {
   
    const [completed, setCompleted] = useState(defaultCompleted);
    
    const completedPercentage = amount > 0 ? Math.round((completed/amount)*100) : 0;
    const dayAndMonth = dayjs(date).format('DD/MM');
    const dayWeek= dayjs(date).format('dddd');

    function handleChangedHabitList(completed: number) {
        setCompleted(completed)
    }

    return (
        <Popover.Root>
            <Popover.Trigger 
            className={clsx("w-10 h-10  rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-background", {
                "bg-violet-500 border-violet-400": completedPercentage >= 80,
                "bg-violet-600 border-violet-500": completedPercentage >= 60 && completedPercentage < 80,
                "bg-violet-700 border-violet-500 opacity-90": completedPercentage >= 40 && completedPercentage < 60,
                "bg-violet-800 border-violet-600 opacity-70": completedPercentage >= 20 && completedPercentage < 40,
                "bg-violet-900 border-violet-700 opacity-50": completedPercentage > 0 && completedPercentage < 20,
                "bg-zinc-900 border-2 border-zinc-800": completedPercentage == 0,
            })}/>
            
            <Popover.Portal>
                <Popover.Content className='min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col'>
                    <span className='font-semibold text-zinc-400'>{dayWeek}</span>
                    <span className='mt-1 font-extrabold leading-tight text-3xl'> {dayAndMonth}</span>
                    
                    <ProgressBar progress={completedPercentage} />

                    <HabitList date={date} onChangedHabitList={handleChangedHabitList}/>

                    <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}

