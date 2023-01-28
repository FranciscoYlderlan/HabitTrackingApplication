import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateDatesFromYearBeginning();

const minimumsummaryDateSize = 18 * 7;
const amoutOfDaysToFill = minimumsummaryDateSize - summaryDates.length;

type  Summary = Array<{
    id: string;
    date: string;
    amount:number;
    completed:number;
}>
export function SummaryTable() {
    
    const [summary, setSummary] = useState<Summary>([])
    
    useEffect(() => {
        api.get('summary').then(response => {
            setSummary(response.data)
        })
    },[])

    return(
        <div className="w-full flex">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
               {
                    weekDays.map((weekDay, index) => {
                        return (
                            <span key={`${weekDay}+${index}`} className="text-zinc-400 text-xl font-bold
                                    h-10 w-10 flex items-center justify-center"> { weekDay } </span>
                        );
                    })
               }
            </div>
            <div className="grid grid-rows-7 grid-flow-col gap-3">
               {
                    summary.length > 0 &&
                    summaryDates.map((date) => {
                        const dayInSummary = summary.find(day => {
                            return dayjs(date).isSame(day.date, 'day');
                        })
                        return (
                            <HabitDay 
                                date={date}
                                amount={dayInSummary?.amount} 
                                defaultCompleted={dayInSummary?.completed} 
                                key={`${date}`}
                            />
                        )
                    })
               }
               {amoutOfDaysToFill > 0 && Array.from({length: amoutOfDaysToFill}).map((_,index) => {
                    return (
                        <span key={`${index}`} 
                              className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800
                              rounded-lg opacity-40 cursor-not-allowed" />
                    )
               })}
            </div>
        </div>
    );
}