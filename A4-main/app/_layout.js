import { Slot } from "expo-router";

export default function SlotLayout(){
    return <Slot screenOptions = {{headerShown: false}} />; 
}