import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Header from '../components/Header';;
import { Avatar } from '@rneui/themed';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import BotNavbar from '../components/BotNavbar';
import BarGraph from '../components/BarGraph';
import DataCard from '../components/DataCard';
import MotivationCard from '../components/MotivationCard';
import { useGetHello } from '../utils/api/hello.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../utils/api/fitbit.api';
import { useFocusEffect } from '@react-navigation/native';

// to be replaced by real data
const dummydata = [
  { day: "MON", steps: 13120 },
  { day: "TUE", steps: 13200 },
  { day: "WED", steps: 14250 },
  { day: "THU", steps: 13030 },
  { day: "FRI", steps: 10557 },
  { day: "SAT", steps: 13976 },
  { day: "SUN", steps: 12250 },
];



const Home = ({headerTitle, headerSubtitle, navigation}) => {
  // only for trial
    // const result = useGetHello()
    const [userData, setUserData] = useState(0);
    const [tokens, setTokens] = useState(null)
    const iconSize = 35;


    useFocusEffect( () => {
      getTokens()
    })

    const getTokens = async () => {
        try {
          const fetchedTokens = await AsyncStorage.getItem('fitbitTokens')
          // console.log("TOKENS", tokens)
          if (fetchedTokens && fetchedTokens !== "{}"){
            if (tokens !== fetchedTokens) {
                setTokens(fetchedTokens)
            }
          }
          return tokens === null ? null : JSON.parse(tokens) ;
        } catch(e) {
          // error reading value
        }
      }

      
  
      useFocusEffect( 
        useCallback(() => {
          const fetchProfile = async() => {
            if (tokens && tokens !== "{}"){
              const result = await getProfile(JSON.parse(tokens) )
              console.log("PROFILE:::",result)
              if (!result.error){
                if (result.data != userData) {
                  setUserData(result.data.user)
                }
              } else {
                  Alert.alert('Something went wrong. Please try again')
              }
          }}
          fetchProfile()
        }, [tokens])
      )

     
    
    
    const leftComponent = <View style={{width:180}}>
    <Text style={{...styles.heading, fontSize: 25}}>Hi, {userData?.firstName}</Text>
    <Text style={styles.subheading}>{headerSubtitle}</Text>
    </View>
    return (
      <SafeAreaProvider>
        <ScrollView style={styles.container}>
          <Header leftComponent={leftComponent} rightComponent={
            <Avatar
              size={64}
              rounded
              // style={styles.avatar}
              source={{uri:userData ? userData.avatar640 : "https://randomuser.me/api/portraits/men/36.jpg"}}
              onPress={() => navigation.push("Profile")}
              containerStyle={{ backgroundColor: '#6733b9' }}
            />
          }/>
          <View style={{ flexDirection: "row", flexWrap: "wrap-reverse", alignItems: 'center', justifyContent: 'center'}}>
            <DataCard title="Steps" number="7392" unit="steps" minWidth={160}/>
            <DataCard title="Calories" number="1027" unit="cal" minWidth={160}/>
            <DataCard title="Distance" number="7.4" unit="Km" minWidth={160}/>
            <DataCard title="Floors" number="11" minWidth={160}/>
            <DataCard title="Activity" number="02:33:21" unit="mins" minWidth={200}/>
          </View>
          
          <Text style={{...styles.heading,fontSize: 20, marginLeft: 20, marginTop: 10}}>Weekly Log Steps</Text>
          <BarGraph data={dummydata}/>
          <MotivationCard title="Keep the progress!" text="You have 47% more steps than last week!" minWidth={350}/>
          <StatusBar style="auto" />
        </ScrollView>
      </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  heading: {
    color: 'black',
    
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold'
  },
  subheading: {
    color: 'black',
    fontSize: 18,
    // width: 250,
    fontFamily: 'Poppins-Regular'
  },

      
});

export default Home;