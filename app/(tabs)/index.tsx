import { client, DATABASE_ID, databases, HABITS_TABLE_ID, RealTimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text , ScrollView} from "react-native";
import { Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface } from "react-native-paper";



export default function Index() {
  const{signOut, user} = useAuth();
  const [habit, setHabit] = useState<Habit[]>()

  const swipeableRefs = useRef<{[key: string]: Swipeable | null }>({})

  useEffect(()=>{
    if (user){
      const channel = `databases.${DATABASE_ID}.collections.${HABITS_TABLE_ID}.documents`
      const habitsSubscription = client.subscribe(
        channel,
        (response: RealTimeResponse) => {
          if (response.events.includes("databases.*.collections.*.documents.*.create")){
            fetchhabits();
          } else if(response.events.includes("databases.*.collections.*.documents.*.update")){
              fetchhabits();
          }else if(response.events.includes("databases.*.collections.*.documents.*.delete")){
              fetchhabits();
          }
        }
      );    
      fetchhabits();
      return () =>{
        habitsSubscription();
      }
    }
  },[user])

  const fetchhabits = async () => {
    try{
      const response = await databases.listDocuments(
        DATABASE_ID, 
        HABITS_TABLE_ID,
        [Query.equal("user_id", user?.$id ?? "")]
        );
        // console.log(response.documents)
        setHabit(response.documents as Habit[]);
    }catch(error){
      console.log(error);
    }
  }

  const renderLeftActions = () => (
    <View style={styles.swipeLeftAction}>
      <MaterialCommunityIcons 
        name="trash-can-outline"
        size={32} 
        color={"#fff"}
      />
    </View>
  );
  
  const handleDelete = async (id: string) => {
    try{
      await databases.deleteDocument(DATABASE_ID, HABITS_TABLE_ID, id)
    }catch(error){
      console.error(error)
    }
  }

  const renderRightActions = () => (
    <View style={styles.swipeRightAction}>
      <MaterialCommunityIcons 
        name="check-circle-outline"  
        size={32} 
        color={"#fff"}
      />
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text} variant="headlineSmall">Rotinas de Hoje</Text>
        <Button mode="text" onPress={signOut} icon={"logout"}>Sair</Button>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
      {habit?.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Você ainda não tem uma rotina cadastrada. Adicione sua primeira!</Text>
        </View>
      ) : (
        habit?.map((habit, index) => (
          <Swipeable ref={(ref) =>{
            swipeableRefs.current[habit.$id] = ref
          }} key={index}
          overshootLeft={false}
          overshootRight={false}
          renderLeftActions={renderLeftActions}
          renderRightActions={renderRightActions}
          onSwipeableOpen={(direction) =>{
              if (direction === "left"){
                handleDelete(habit.$id)
              }
              swipeableRefs.current[habit.$id]?.close();
            }
          }
          >
            <Surface  style={styles.card} elevation={1}>
              <View style={styles.cardContent}>
                <Text style= {styles.cardTitle}>{habit.title}</Text>
                <Text style= {styles.cardDescription}>{habit.description}</Text>
                <View style= {styles.cardFooter}>
                  <View style= {styles.streakBadge}><MaterialCommunityIcons name="fire" size={18} color={"#ff9800"}/>
                    <Text style= {styles.streaktext}>{habit.streak_count} dias seguidos</Text>
                  </View>
                  <View style= {styles.frequencyBadge}>
                    <Text style= {styles.frequencyText}>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)} </Text>
                  </View>
                </View>
              </View>
            </Surface> 
          </Swipeable>         
        ))
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:16,
    backgroundColor:"#f5f5f5"},
  header:{
    flexDirection:"row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title:{
    fontWeight:"bold",
    color: "#000",
    fontSize:32
  },
  card:{
    marginBottom:18,
    borderRadius:18,
    backgroundColor:"#f7f1fa",
    shadowColor:"#000",
    shadowOffset:{
      width:0, 
      height: 2},
    shadowOpacity:0.08,
    shadowRadius:8,
    elevation:4
  },
  cardContent:{
    color: "#000",
    padding:20,
  },
  cardTitle:{
    color: "#2223b",
    fontSize:20,
    fontWeight: "bold",
    marginBottom:4
  },
  cardDescription:{
    color: "#6c6c80",
    fontSize:15,
    marginBottom:16
  },
  cardFooter:{
    color: "#000",
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },
  streakBadge:{
    flexDirection:"row",
    alignItems:"center",
    backgroundColor: "#FFF3e0",
    borderRadius:12,
    paddingHorizontal:10,
    paddingVertical:4
  },
  streaktext:{
    color: "#ff9800",
    marginLeft:6,
    fontWeight:"bold",
    fontSize:14,
  },
  frequencyBadge:{
    backgroundColor: "#ede7f6",
    borderRadius:34,
    paddingHorizontal:12,
    paddingVertical:4
  },
  frequencyText:{
    color: "#7c4dff",
    fontWeight:"bold",
    fontSize:14,
    textTransform:"capitalize"
  },
  text:{
    color: "#000",
    fontSize:32
  },
  emptyState:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  emptyStateText:{
    color: "#666666",
  },
  swipeLeftAction:{
    justifyContent:"center",
    alignItems:"flex-start",
    flex:1,
    backgroundColor:"#e53935",
    borderRadius:18,
    marginBottom:18,
    marginTop:2,
    paddingLeft:16,
  },
  swipeRightAction:{
    justifyContent:"center",
    alignItems:"flex-end",
    flex:1,
    backgroundColor:"#4caf50",
    borderRadius:18,
    marginBottom:18,
    marginTop:2,
    paddingRight:16,
  },
})
