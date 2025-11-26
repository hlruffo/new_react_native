import { View, StyleSheet} from 'react-native';
import { SegmentedButtons, TextInput, Button } from 'react-native-paper';


const FREQUENCIES = ["diário", "semanal", "mensal"]

export default function AddHabbitScreen() {
    return (
        <View style={ styles.container }>
            <TextInput label="Título" mode="outlined" style={ styles.input } />
            <TextInput label="Descrição" mode="outlined" style={ styles.input }/>
            <View style={ styles.frequencyContainer }>
                <SegmentedButtons 
                    buttons={FREQUENCIES.map((freq)=>({
                            value:freq,
                            label:freq.charAt(0).toUpperCase() + freq.slice(1),
                        })
                    )}
                    style={ styles.segmentedButtons }
                />
            </View>
        <Button mode="contained" style={ styles.buttons }>Adicionar tarefa</Button>
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
        }
    }
)
