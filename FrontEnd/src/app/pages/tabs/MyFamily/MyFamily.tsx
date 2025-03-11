import { links } from "@/src/api/api";
import { EmDev } from "@/src/app/components/EmDev/EmDev";
import { AuthContext } from "@/src/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Alert, SafeAreaView, Text } from "react-native";

export default function MyFamily() {
    const authContext = useContext(AuthContext)
    const router = useRouter()

    // useEffect(() => {
    //         const checkUser = async () => {
    //             const response = await links.checkUserHaveFamily(authContext.user?.name || '');
    //             if (response.data.model === false) {
    //                 Alert.alert(
    //                     "Família não encontrada",
    //                     "Você não possui uma família cadastrada. Deseja criar uma agora?",
    //                     [
    //                         {
    //                             text: "Cancelar",
    //                             onPress: () => router.replace("/pages/Default"),
    //                             style: "default"
    //                         },
    //                         {
    //                             text: "Criar",
    //                             onPress: () => router.push("/pages/Family/FormAddFamily/FormAddFamily"),
    //                             style: "default"
    //                         }
    //                     ]
    //                 )
    //             }
    //         }
    
    //         checkUser();
    //     } , []);

    return (
        <EmDev />
    )
}