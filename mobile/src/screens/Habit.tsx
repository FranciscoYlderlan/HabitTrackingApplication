import { ScrollView, View, Text, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";
import { HabitsEmpty } from "../components/HabitsEmpty"; 

import dayjs from "dayjs";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import clsx from "clsx";


interface Params {
    date:string;
}
interface HabitsInfoProps {
    possibleHabits: HabitsProps[];
    completedHabits: String[];
    
}

interface HabitsProps {
    id: string;
    title: string;
    created_at: Date;
}



export function Habit() {
    const route = useRoute();
    const [loading, setLoading] = useState(true)
    const [habitsInfo, setHabitsInfo] = useState<HabitsInfoProps>();
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);
    
    const { date } = route.params as Params;
    const parsedDate = dayjs(date);
    const notToday = parsedDate.endOf('day').isBefore(new Date());
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    const habitsProgress = habitsInfo?.possibleHabits.length
    ? generateProgressPercentage(habitsInfo?.possibleHabits.length, completedHabits.length)
    : 0

    async function fetchHabits() {
        try {
            setLoading(true);
            const response = await api.get('day',{params: { date }});
            setHabitsInfo(response.data)
            setCompletedHabits(response.data.completedHabits);
        } catch (error) {
            console.log(error);
            Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos');
        } finally {
            setLoading(false);
        }
    }

    async function fetchCheckedHabits (habitId: string) {
        try {
            await api.patch(`habits/${habitId}/toggle`);
        } catch (error) {
            console.log(error);
            Alert.alert('Ops', 'Não foi possível salvar as informações dos hábitos');
            
        }
    }

    async function handleCheckedHabits(habitId: string) {
        await fetchCheckedHabits(habitId);
        if(completedHabits.includes(habitId)) {

            setCompletedHabits(prevState => prevState.filter(id => habitId !== id));
        }else {
            
            setCompletedHabits(prevState => [...prevState, habitId]);
        }
        
    }


    useEffect(() => { fetchHabits() },[]);
    
    if(loading) return <Loading/>;
    
    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{paddingBottom:100}}
            >
                <BackButton/>
                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>
                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>
                
                <ProgressBar progress={habitsProgress}/>

                <View className={ clsx("mt-6",{ "opacity-60": notToday }) }>
                    {
                        habitsInfo?.possibleHabits
                        ? habitsInfo?.possibleHabits.map( (habit) => {
                            
                            return (
                                <CheckBox 
                                    key={habit.id} 
                                    title={habit.title} 
                                    checked={completedHabits.includes(habit.id)}
                                    disabled={notToday}
                                    onPress={() => {handleCheckedHabits(habit.id)}}
                                />
                            )}
                        )
                        : <HabitsEmpty/>
                    }
                </View>
                {
                notToday && 
                <Text className="text-white mt-10 text-center">
                    Não é possível alterar atividades em datas passadas.
                </Text>
                }
            </ScrollView>
        </View>
        
    );
}