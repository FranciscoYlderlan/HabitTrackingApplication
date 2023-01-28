import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { Checkbox } from "./Checkbox";

interface HabitListProps {
    date: Date;
    onChangedHabitList: (completed: number) => void;
}

interface HabitsProps {
    id: string;
    title: string;
    created_at: string;
}

interface habitsInfoProps {
    possibleHabits: Array<HabitsProps>;
    completedHabits: Array<string>; //string[];
}

export function HabitList({ date, onChangedHabitList }: HabitListProps) {
    const [habitsInfo, setHabitsInfo] = useState<habitsInfoProps>();
    
    const isNotToday = dayjs(date).endOf('day').isBefore(new Date());

    useEffect( () => {
        try {
            api.get('day', {
                params: {
                    date: date.toISOString()
                }
            }).then( response => { 
                if(!response) {
                     alert('Não foi possível carregar a listagem');
                }
                setHabitsInfo(response.data);
            })
        } catch (error) {
            console.log(error);
        }
    },[])
    async function handleToggleHabit(habitId : string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`)
            const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);
            
            let completedHabits : string[] = [];
            
            if(isHabitAlreadyCompleted) {
                completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId );
            
            } else {
                completedHabits = [...habitsInfo!.completedHabits, habitId]
            }
            setHabitsInfo({
                possibleHabits: habitsInfo!.possibleHabits,
                completedHabits
            })
            onChangedHabitList(completedHabits.length);
        } catch (error) {
            console.log(error)
        }
         
        
    }   

    return (
        <div className='mt-6 flex flex-col gap-3'>

            {
                habitsInfo?.possibleHabits.map( (habit : HabitsProps) => 
                    { 
                        return (
                            <Checkbox 
                                key={habit.id} 
                                title={habit.title}
                                onCheckedChange={() => handleToggleHabit(habit.id)}
                                checked={habitsInfo!.completedHabits.includes(habit.id)}
                                disabled={isNotToday}
                                
                            />
                        )
                    }
                ) 
            }
            
        </div>
    )
}