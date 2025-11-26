import { DATABASE_ID, databases, HABITS_TABLE_ID } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, StyleSheet} from 'react-native';
import { ID } from 'react-native-appwrite';
import { SegmentedButtons, TextInput, Button, useTheme , Text} from 'react-native-paper';


const FREQUENCIES = ["diário", "semanal", "mensal"];
type Frequency = (typeof FREQUENCIES)[number];

export default function Addhabitscreen() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [frequency, setFrequency] = useState<Frequency>("diário");
    const [error, setError] = useState<string>("");
    const theme = useTheme();
    const router = useRouter();
    const {user} =useAuth();

    const handleSubmit = async() =>{
        if(!user) return;
        
        try{
        await databases.createDocument(
            DATABASE_ID,
            HABITS_TABLE_ID,
            ID.unique(),
            {
                user_id:user.$id,
                title,
                description,
                frequency,
                streak_count:0,
                last_completed: new Date().toISOString(),
            }
        );

        router.back()
        }catch(error){
            if (error instanceof Error){
                setError(error.message);
                return
            }
            setError("Ocorreu um erro ao salvar")
        }
    }

    return (
        <View style={ styles.container }>
            <TextInput label="Título" mode="outlined" onChangeText={setTitle} textColor="#000" style={ styles.input } />
            <TextInput label="Descrição" mode="outlined" onChangeText={setDescription} textColor="#000" style={ styles.input }/>
            <View style={ styles.frequencyContainer }>
                <SegmentedButtons 
                    value={frequency}
                    onValueChange={(value) => setFrequency(value as Frequency)}
                    buttons={FREQUENCIES.map((freq)=>({
                            value:freq,
                            label:freq.charAt(0).toUpperCase() + freq.slice(1),
                        })
                    )}
                    style={ styles.segmentedButtons }
                />
            </View>
        <Button mode="contained" onPress={handleSubmit} disabled={!title || !description } style={[styles.buttons, (!title || !description) && styles.buttonsDisabled]}>Adicionar rotina</Button>
        {error && <Text style={{color:theme.colors.error}}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
        container:{
            flex:1,
            padding:16,
            backgroundColor:"#f5f5f5",
            justifyContent: "center"
        },
        input:{
            backgroundColor:"#f5f5f5",
            marginBottom:16,
        },
        frequencyContainer:{
            marginBottom:24,
        },
        segmentedButtons:{
        },
        buttons:{
            
        },
        buttonsDisabled:{
            backgroundColor:"#666666"
        }
    }
)
