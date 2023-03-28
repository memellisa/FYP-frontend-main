import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, Card } from '@rneui/themed';


const ArticleCard = ({ imgURI, author, title, date, content, minWidth, onPress}) => {
    return (
    <>  
        <Pressable onPress={onPress} >
            <Card containerStyle={{ ...styles.container, width: minWidth}}  >
                <Image
                    style={styles.image}
                    source={{uri: imgURI}}/>
                <View>  
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.info}>
                        Written By: {author}
                        {"\n"}
                        {date}
                    </Text>
                    <Text style={styles.text}>{content}</Text>
                </View>
            </Card>
        </Pressable>
    </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom:10, 
        borderRadius:10,
        alignItems:'center'
    },

    title: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold'

    },

    text: {
        color: '#808080',
        fontSize: 16,
        paddingEnd: 10,
        fontFamily: 'Poppins-Regular'
    },

    info: {
        color: '#C0C6CC',
        fontSize: 13,
        textAlign: 'right',
        paddingTop: 10,
        paddingBottom: 10,
        paddingEnd: 10,
        fontFamily: 'Poppins-Regular'
    },
    
    image: {
        width: 300,
        height: 200,
        marginVertical: 10
    },
});

export default ArticleCard;