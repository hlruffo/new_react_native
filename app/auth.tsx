import { useState } from "react";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, StyleSheet, View} from "react-native";
import {Button, Text, TextInput, useTheme} from "react-native-paper";
import { useAuth } from "@/lib/auth-context";

export default function AuthScreen(){
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [email, setEmail] =useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>("");
    const theme = useTheme();
    const router = useRouter();
    const {signIn, signUp} = useAuth();

    const handleAuth = async () => {
        if(!email || !password){
            setError("Por favor, preencha todos os campos.");
            return;
        }
        if (password.length < 8){
            setError("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        setError(null);

        if (isSignUp){
            const error = await signUp(email, password);
            if (error){
                setError(error);
                return;
            }
        }else{
            const error = await signIn(email, password);
            if (error){
                setError(error);
                return
            }
            router.replace("/");
        }
    }

    const handleSwitchMode = () => {
        setIsSignUp((prevMode) => !prevMode);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title} variant="headlineMedium">{isSignUp ? "Criar Conta" : "Bem vindo de volta"}</Text>
                <TextInput 
                    label="Email"  
                    autoCapitalize="none" 
                    keyboardType="email-address" 
                    autoCorrect={false} 
                    placeholder="examplo@seuemail.com"
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setEmail}
                />
                <TextInput 
                    label="Password" 
                    secureTextEntry 
                    placeholder="Password" 
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setPassword}
                />

                {error ? <Text style={{color: theme.colors.error, marginBottom: 8}}>{error}</Text> : null}

                <Button 
                    mode="contained" 
                    style={styles.button}
                    onPress={handleAuth}
                >
                        {isSignUp ? "Cadastrar" : "Entrar"}
                </Button>
                <Button 
                    mode="text" 
                    onPress={handleSwitchMode} 
                    style={styles.switchButton}>
                        {isSignUp ? "Já possui uma conta? Clique aqui" : "Não possui uma conta? Clique aqui"}
                </Button>

            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content:{
        flex: 1,
        padding: 16,
        justifyContent: "center",
    }, 
    title:{
        textAlign: "center",
        marginBottom: 24,
    },
    input:{
        marginBottom: 16,
        backgroundColor: "#f5f5f5",
    },
    button:{
        marginTop: 8,
    },
    switchButton:{
        marginTop: 16,
    },

});