import { createContext, useContext } from "react";
import { Models } from "react-native-appwrite";
import { account } from "./appwrite";

// rastrear o estado de autenticação do usuário e fornecer métodos para login, registro e logout.
type AuthContextType = {
    //user: Models.User<Models.Preferences> | null;
    signIn: (email: string, password: string) => Promise<string | null>;
    signUp: (email: string, password: string) => Promise<string | null>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {

    const signUp = async (email: string, password: string) => {
        try{
            await account.create(ID.unique(), email, password)
            await signIn()
            return null
        }catch (error){
            if (error instanceof Error){
                return error.message
            }
            return "Ocorreu um erro durante o cadastro."
        }
    };
    const signIn = async (email: string, password: string) => {
        try{
            await account.createEmailPasswordSession(email, password)
            return null
        }catch (error){
            if (error instanceof Error){
                return error.message
            }
            return "Ocorreu um erro durante o login."
        }
    };
    const signOut = () => {};


    return(
    <AuthContext.Provider value={{signIn, signUp, signOut}}>
            {children}
    </AuthContext.Provider>
    );
}

export function useAuth(){
    const context = useContext(AuthContext);
    if (context === undefined){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}