import { StyleSheet, Text, View, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getFormatedDate } from 'react-native-modern-datepicker'
import DatePickerField from '../components/DatePickerField';
import DropDownField from '../components/DropdownField';
import InputTextField from '../components/InputTextField';
import { Button, Icon } from '@rneui/base';
import { Formik } from 'formik';
import { userHealthValidationSchema, userInfoValidationSchema } from '../utils/validation';
import { createUser } from '../utils/api/user.api';
import { bloodData, booleanData, dietData, formInfoMsgs, frequencyData, sexData } from '../utils/constants';
import { calculateAge, countBMI } from '../utils/functions';
import InfoOverlay from '../components/InfoOverlay';
import { useHeaderHeight } from '@react-navigation/elements'


export default function SelfInputForm({ route, navigation }) {

    const today = new Date()
    const endDate = getFormatedDate(today.setDate(today.getDate()), 'YYYY/MM/DD')
    const [openModal, setOpenModal] = useState(false)
    const [infoVisible, setInfoVisible] = useState(false);
    const [infoMsg, setInfoMsg] = useState(false);
    const height = useHeaderHeight()

    const handleOnPress = () => {
        setOpenModal(!openModal)
    }

    const onPressDone = async (newData) => {
        const temp = {
            "info": {
                "dob": newData.dob,
                "firstName": newData.firstName,
                "lastName": newData.lastName,
                "img": null,
            },
            "health": {
                "alcoholConsumption": parseInt(newData.alcoholConsumption) ,
                "bloodPressure": parseInt(newData.bloodPressure) ? true : false,
                "bloodType": newData.bloodType,
                "cholesterol": parseInt(newData.cholesterol) ? true : false,
                "diet": newData.diet,
                "insulin": parseInt(newData.insulin) ? true : false,
                "sex": newData.sex,
                "smokingStatus": parseInt(newData.smokingStatus),
                "height": parseFloat(newData.height),
                "weight": parseFloat(newData.weight)
            }
         }
        sendData(temp)
    }

    const sendData = async (newData) => {
        // console.log("NEW DATA:::",newData)
        const result = await createUser(newData)
        // console.log("EDIT HEALTH:::",result)
        if (!result.error){
            // console.log('CREATED USERR', JSON.stringify(result.data))
            navigation.navigate('Main')
        } else {
            // console.log(result.error)
            Alert.alert('Something went wrong. Please try again')
        }
    }

    const toggleOverlay = () => {
        setInfoVisible(!infoVisible);
      };

    const onIconPress = (msg) => {
        setInfoMsg(msg)
        toggleOverlay()
    }

    return (
        <SafeAreaProvider>
             <KeyboardAvoidingView
                keyboardVerticalOffset={height+5}
                behavior="padding"
                style={styles.screenContainer}
                enabled>
                    <ScrollView
                        hasSafeArea={false}
                    >
                    <Text style={styles.title}> 
                        Please fill in the fields below to allow us to better understand you
                    </Text>

                    <Formik
                        validateOnMount={true}
                        validationSchema={userInfoValidationSchema.concat(userHealthValidationSchema)}
                        initialValues={{ 
                            firstName:'', 
                            lastName:'', 
                            dob:endDate, 
                            insulin:'',
                            cholesterol:'', 
                            diet:'', 
                            smokingStatus:'', 
                            alcoholConsumption:'', 
                            bloodPressure:'', 
                            sex:'', 
                            height:'', 
                            weight:'', 
                            bloodType:''}}
                        onSubmit={values => onPressDone(values)}
                    >
                        {({ handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        isValid, }) => (
                        <>
                            <InfoOverlay visible={infoVisible} toggleOverlay={toggleOverlay} message={infoMsg} />
                            {/* {InfoOverlay(infoVisible, toggleOverlay, infoMsg)} */}
                            
                            <InputTextField 
                                text={"First Name"} 
                                value={values.firstName} 
                                onChangeText={handleChange('firstName')} 
                                errorMessage={(errors.firstName && touched.firstName) ? errors.firstName : ''} 
                                handleBlur={handleBlur('firstName')} />
                            {/* {InputTextField(
                                'First Name', 
                                values.firstName,
                                handleChange('firstName'), 
                                (errors.firstName && touched.firstName) ? errors.firstName : '', 
                                handleBlur('firstName'))} */}

                            <InputTextField 
                                text={"Last Name"} 
                                value={values.lastName} 
                                onChangeText={handleChange('lastName')} 
                                errorMessage={(errors.lastName && touched.lastName) ? errors.lastName : ''} 
                                handleBlur={handleBlur('lastName')} />
                            {/* {InputTextField(
                                'Last Name', 
                                values.lastName, 
                                handleChange('lastName'), 
                                (errors.lastName && touched.lastName) ? errors.lastName : '', 
                                handleBlur('lastName'))} */}
                            
                            <DatePickerField text={"Date of Birth"} openModal={openModal} handleOnPress={handleOnPress} date={values.dob} handleChangeDate={handleChange('dob')} />
                            {/* {DatePickerField('Date of Birth', openModal, handleOnPress, values.dob, handleChange('dob'))} */}

                            <View style={styles.optionView}>
                                <Text style={styles.fieldText}>Age</Text>
                                <Text style={styles.valueText}>{ !isNaN(values.dob) || !isNaN(calculateAge(values.dob)) ? calculateAge(values.dob) : '-'}</Text>
                                <Icon name="help" color="#0F52BA" size='18' onPress={() => onIconPress(formInfoMsgs.age)}/>
                            </View>
                            
                            <DropDownField 
                                text={"Diet"} 
                                value={values.diet} 
                                data={dietData} 
                                setOnChange={handleChange('diet')} 
                                handleOnFocus={(val) => touched.diet = val} 
                                errorMessage={((errors.diet && touched.diet) ? errors.diet : '')} 
                                onIconPress={null} />
                            {/* {DropDownField(
                                "Diet", 
                                values.diet, 
                                dietData, 
                                handleChange('diet'),  
                                (val) => touched.diet = val, 
                                (errors.diet && touched.diet) ? errors.diet : '')} */}

                            <DropDownField 
                                text={"Smoking Status"} 
                                value={values.smokingStatus} 
                                data={frequencyData} 
                                setOnChange={handleChange('smokingStatus')} 
                                handleOnFocus={(val) => touched.smokingStatus = val} 
                                errorMessage={((errors.smokingStatus && touched.smokingStatus) ? errors.smokingStatus : '')} 
                                onIconPress={null} />
                            {/* {DropDownField(
                                "Smoking Status", 
                                values.smokingStatus, 
                                frequencyData, 
                                handleChange('smokingStatus'),  
                                (val) => touched.smokingStatus = val, 
                                (errors.smokingStatus && touched.smokingStatus) ? errors.smokingStatus : '')} */}

                            <DropDownField 
                                text={"Alcohol Consumption"} 
                                value={values.alcoholConsumption} 
                                data={frequencyData} 
                                setOnChange={handleChange('alcoholConsumption')} 
                                handleOnFocus={(val) => touched.alcoholConsumption = val} 
                                errorMessage={((errors.alcoholConsumption && touched.alcoholConsumption) ? errors.alcoholConsumption : '')} 
                                onIconPress={null} />
                            {/* {DropDownField(
                                "Alcohol Consumption", 
                                values.alcoholConsumption, 
                                frequencyData, 
                                handleChange('alcoholConsumption'),  
                                (val) => touched.alcoholConsumption = val, 
                                (errors.alcoholConsumption && touched.alcoholConsumption) ? errors.alcoholConsumption : '')} */}

                            <DropDownField 
                                text={"Blood Pressure Medication"} 
                                value={values.bloodPressure} 
                                data={booleanData} 
                                setOnChange={handleChange('bloodPressure')} 
                                handleOnFocus={(val) => touched.bloodPressure = val} 
                                errorMessage={((errors.bloodPressure && touched.bloodPressure) ? errors.bloodPressure : '')} 
                                onIconPress={() => onIconPress(formInfoMsgs.medication)} />
                            {/* {DropDownField(
                                "Blood Pressure Medication", 
                                values.bloodPressure, 
                                booleanData, 
                                handleChange('bloodPressure'),  
                                (val) => touched.bloodPressure = val, 
                                (errors.bloodPressure && touched.bloodPressure) ? errors.bloodPressure : '',
                                () => onIconPress(formInfoMsgs.medication))} */}

                            <DropDownField 
                                text={"Insulin Medication"} 
                                value={values.insulin} 
                                data={booleanData} 
                                setOnChange={handleChange('insulin')} 
                                handleOnFocus={(val) => touched.insulin = val} 
                                errorMessage={((errors.insulin && touched.insulin) ? errors.insulin : '')} 
                                onIconPress={() => onIconPress(formInfoMsgs.medication)} />
                            {/* {DropDownField(
                                "Insulin Medication", 
                                values.insulin, 
                                booleanData, 
                                handleChange('insulin'),  
                                (val) => touched.insulin = val, 
                                (errors.insulin && touched.insulin) ? errors.insulin : '',
                                () => onIconPress(formInfoMsgs.medication))} */}

                            <DropDownField 
                                text={"Cholesterol Medication"} 
                                value={values.cholesterol} 
                                data={booleanData} 
                                setOnChange={handleChange('cholesterol')} 
                                handleOnFocus={(val) => touched.cholesterol = val} 
                                errorMessage={((errors.cholesterol && touched.cholesterol) ? errors.cholesterol : '')} 
                                onIconPress={() => onIconPress(formInfoMsgs.medication)} />
                            {/* {DropDownField(
                                "Cholesterol Medication", 
                                values.cholesterol, 
                                booleanData, 
                                handleChange('cholesterol'),  
                                (val) => touched.cholesterol = val, 
                                (errors.cholesterol && touched.cholesterol) ? errors.cholesterol : '',
                                () => onIconPress(formInfoMsgs.medication))} */}

                            <DropDownField 
                                text={"Sex"} 
                                value={values.sex} 
                                data={sexData} 
                                setOnChange={handleChange('sex')} 
                                handleOnFocus={(val) => touched.sex = val} 
                                errorMessage={((errors.sex && touched.sex) ? errors.sex : '')} 
                                onIconPress={null} />
                            {/* {DropDownField(
                                "Sex", 
                                values.sex, 
                                sexData, 
                                handleChange('sex'),  
                                (val) => touched.sex = val, 
                                (errors.sex && touched.sex) ? errors.sex : '')} */}

                            <DropDownField 
                                text={"Blood Type"} 
                                value={values.bloodType} 
                                data={bloodData} 
                                setOnChange={handleChange('bloodType')} 
                                handleOnFocus={(val) => touched.bloodType = val} 
                                errorMessage={((errors.bloodType && touched.bloodType) ? errors.bloodType : '')} 
                                onIconPress={null} />
                            {/* {DropDownField(
                                "Blood Type", 
                                values.bloodType, 
                                bloodData, 
                                handleChange('bloodType'),  
                                (val) => touched.bloodType = val, 
                                (errors.bloodType && touched.bloodType) ? errors.bloodType : '')} */}

                            <InputTextField 
                                text={"Height (cm)"} 
                                value={values.height} 
                                onChangeText={handleChange('height')} 
                                errorMessage={(errors.height && touched.height) ? errors.height : ''} 
                                handleBlur={handleBlur('height')} />
                            {/* {InputTextField(
                                'Height (cm)', 
                                values.height, 
                                handleChange('height'), 
                                (errors.height && touched.height) ? errors.height : '',
                                handleBlur('height'))} */}

                            <InputTextField 
                                text={"Weight (kg)"} 
                                value={values.weight} 
                                onChangeText={handleChange('weight')} 
                                errorMessage={(errors.weight && touched.weight) ? errors.weight : ''} 
                                handleBlur={handleBlur('weight')} />
                            {/* {InputTextField(
                                'Weight (kg)', 
                                values.weight, 
                                handleChange('weight'), 
                                (errors.weight && touched.weight) ? errors.weight : '', 
                                handleBlur('weight'))} */}
                        
                            <View style={styles.optionView}>
                                <Text style={styles.fieldText}>BMI</Text>
                                <Text style={styles.valueText}>{(values.height && values.weight && isFinite(countBMI(values.height, values.weight))) ? countBMI(values.height, values.weight) : '-'}</Text>
                                <Icon name="help" color="#0F52BA" size='18' onPress={() => onIconPress(formInfoMsgs.bmi)}/>
                            </View>

                            <Button 
                                title="Done" 
                                buttonStyle={styles.button} 
                                onPress={handleSubmit}
                                disabled={!isValid}
                            />
                        </>)}
                    </Formik>
                </ScrollView>

            </KeyboardAvoidingView>
            
        </SafeAreaProvider>
      );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },

    optionView: {
        flexDirection: 'row',
        marginTop: 25,
        marginHorizontal: 20,
        alignItems: 'center'
    },

    fieldText: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        width: '40%'
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
        marginRight: 5,
        flexWrap: 'wrap',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
    },

    closeModalText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },

    itemStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },

    infoText: {
        color: 'grey', 
        marginHorizontal: 28, 
        marginTop: 10, 
        textAlign: 'justify'
    },
    title: {
        fontSize: 19, 
        fontFamily: "Poppins-Bold", 
        color: '#0F52BA',
        alignSelf: 'center',
        textAlign:'center',
        paddingTop: 10,
        paddingHorizontal: 30
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '90%',
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    button: {
        marginTop: 30,
        marginBottom: 40,
        width: '40%',
        height: 50,
        borderRadius: 5,
        alignSelf: 'center'
    },
    inputTitleView: {
        width: '35%',
        flexDirection: 'row',
        alignItems: 'center',
    },

})