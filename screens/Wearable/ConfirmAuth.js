import { Image, StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';


// TODO: detect whether there is already a wearable connected to the account or not
export default function ConfirmAuth({ route, navigation }) {
    const [authCode, setAuthCode] = useState('')
    const [pressed, setPressed] = useState(false)
    
    useEffect(() => {
        if (authCode !== ''){
            navigation.push("Success Splash")
        }

    }, [authCode])

    useEffect(() => {
        const linkingEvent = Linking.addEventListener('url', handlePressButtonAsync);
        Linking.getInitialURL().then(() => {
           if (pressed) {
             handlePressButtonAsync();
           }
        });
        return () => {
           setPressed(false)
           linkingEvent.remove();
        };
     }, [pressed, handlePressButtonAsync]);
     
    
    const handlePressButtonAsync = async () => {
        let response = await WebBrowser.openAuthSessionAsync(
                    "https://www.fitbit.com/oauth2/authorize?client_id=23959L&response_type=code&code_challenge=jdJbKAkrq4qYt5sy5DRKAnvIAt-Ntmwhbr2itg6Nb-8&code_challenge_method=S256&scope=activity%20heartrate%20location%20nutrition%20oxygen_saturation%20profile%20respiratory_rate%20settings%20sleep%20social%20temperature%20weight",
                    Linking.createURL()
                    )
        
        if (response && response.type == 'success'){
            const url = response.url
            setAuthCode(url.split('code=')[1])
        }
        
        console.log('Resp',response)

        WebBrowser.dismissBrowser()
      };


      
    return (
        <SafeAreaProvider>
            <View
                style={styles.screenContainer}
                scrollable={true}
                hasSafeArea={false}
            >
                <View style={styles.promptView}>
                    <Image source={require('../../assets/Fitbit_logo_RGB.png')} style={styles.logo} transition={false}/>
                    <Text style={styles.subtitle}>
                        Connect your Fitbit account to track your physical activities. 
                        Activity recorded on Fitbit will count towards your Coronary Heart Disease risk calculation. 
                        Click Connect below to sign in to your Fitbit account and authorize access
                    </Text>
                    {/* <Text>{authCode}</Text> */}
                </View>


                <TouchableHighlight underlayColor="#DDDDDD" style={styles.button} onPress={()=>setPressed(true)}>
                        <Text style={styles.text}>Connect</Text>
                </TouchableHighlight>

                
            </View>
        </SafeAreaProvider>
    
      );
}

const styles = StyleSheet.create({
    logo: {
        width: '100%', 
        height: 40,
        resizeMode: 'contain',
    },
    screenContainer: {
        paddingHorizontal: 30,
        // justifyContent: 'center',
        // marginTop: -65,
        flex: 1,
        backgroundColor: '#fff',
    },

    promptView: {
        // position: 'relative',
        marginTop: 100,
        marginHorizontal: 10,
        // paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
    },

    optionText: {
        fontSize: 16,
        // paddingTop:5,
        fontFamily: 'Poppins-SemiBold',
        width: 140
    },

    dropdown: {
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
        paddingRight: 5,
        flex:1
    },

    valueText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        width: 190,
        flexWrap: 'wrap',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1
    },

    itemStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },
    subtitle: {
        color: 'black',
        fontSize: 16,
        // fontWeight: 'bold',
        fontFamily: 'Poppins-Regular',
        alignSelf: 'center',
        textAlign: 'center',
        marginTop: 20,
    },

    button: {
        marginVertical: 10,
        width: 260,
        height: 70,
        alignSelf: 'center',
        justifyContent: 'center',
        // borderWidth: 1.5,
        backgroundColor:'#0F52BA',
        borderRadius: 10,
        // borderColor: '#c4c4c4',
        position: 'absolute',
        bottom:40,

    },

    text: {
        fontSize: 20,
        alignSelf: 'center',
        fontFamily: 'Poppins-SemiBold',
        paddingVertical: 5,
        color: 'white'
    },

})