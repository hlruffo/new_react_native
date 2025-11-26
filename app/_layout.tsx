import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const {user, isLoadingUser} = useAuth(); 

  //detecta em que pagina o usuário está.
  // estando em auth o redirecionamento abaixo é desnecessário
  const segments = useSegments()

  useEffect(()=>{
    const inAuthGroup = segments[0] === "auth"
    if(!user && !inAuthGroup && !isLoadingUser){
      router.replace("/auth");
    }else if (user && inAuthGroup && !isLoadingUser){
      router.replace("/");
    }
  }, [user,segments]); //esse array determina que alterações nas variaveis citadas disparam o useEffect

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <RouteGuard>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </RouteGuard>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
