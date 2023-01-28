import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export function HabitsEmpty() {
    const { navigate } = useNavigation()
    return (
        <Text className="text-zinc-400 text-base">
            Você não possui hábitos cadastrados para hoje {' '}
            <Text 
                className="text-violet-400 text-base underline active:text-violet-500"
                onPress={ () => navigate('newHabit') }    
            >
                comece cadastrando um aqui.
            </Text>
        </Text>
    )
}