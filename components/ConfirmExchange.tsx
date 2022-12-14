import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Image, TouchableOpacity, View, Text, Button, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookCard from '../components/BookCard';
import { Book } from '../types';
import { getUsername } from '../components/userTokenManager';

import EditScreenInfo from '../components/EditScreenInfo';
// import {} from '../components/Themed';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { Card } from 'react-native-paper';
import MatchScreen from '../screens/MatchScreen';
import ReputationModal from './ReputationModal';
import { openInbox } from 'react-native-email-link';
interface Props {
    item: {
        thumbnail1:string,
        title1: string,
        author1: string,
        condition1: string,
        username1: string,
        email1: string,
        thumbnail2:string,
        title2: string,
        author2: string,
        condition2: string,
        username2: string,
        email2: string
    },
    setCurrentView: Function
}

const ConfirmExchange: React.FC<Props> = ({item, setCurrentView}) => {
    const [openModal, setOpenModal] = useState(false);
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [matchedBooks, setMatchedBooks] = useState<[]>([]);
    const [rerender, setRerender] = useState<number>(0);
    useEffect(()=>{
        console.log(item)
    },[])

    const onClose = () => {
      setOpenModal(false);
    }


    //when 'confirm exchange' button is pressed

  const sendCancel = async () => {
      try {
      //sends a post request to cancel exchange
      const put = await axios.put(
          `https://binderapp-server.herokuapp.com/api/matches/deny/user/${getUsername()}`, item
      );
      const data = await put.data;
      setRerender(data)
      if(data.status === 200) {
          console.log("cancelled exchange")
      }
      } catch (err) {
      console.log(err);
      }
  }
  const emailTitle = `Book x Change Match`

  const emailBodyUser2 = `Hello, \n\n\nThank you for accepting the book match! \n\n Below are the details of my book: 
    \n\n${item.title1}, \nby ${item.author1}, \nin ${item.condition1} condition \n\nand I am interested in your book:
    \n\n${item.title2}, \nby ${item.author2}, \nin ${item.condition2} condition\n\nPlease let me know you preferred method of exchanging. I look forward to hearing back from you!\n\nWith regards, \n\n${item.username1}`
    
  const emailBodyUser1 = `Hello, \n\n\nThank you for accepting the book match! \n\n Below are the details of my book: 
    \n\n${item.title2}, \nby ${item.author2}, \nin ${item.condition2} condition \n\nand I am interested in your book:
    \n\n${item.title1}, \nby ${item.author1}, \nin ${item.condition1} condition\n\nPlease let me know you preferred method of exchanging. I look forward to hearing back from you!\n\nWith regards, \n\n${item.username2}`
    
    return (
        <View style={styles.item}> 
            <TouchableOpacity>
                <Button 
                    title = 'back'
                    onPress={()=> 
                        setCurrentView("all matches")
                    }
                ></Button>
            </TouchableOpacity>
            
          <>
            {getUsername()!==item.username1?(
              <View style={styles.bookContainer}> 
                <Image
                style={{
                    borderColor: 'black',
                    borderWidth: 2,
                    height: 100,
                    width: 100,
                }}
                source={{
                    uri: item.thumbnail1,
                    width: 50,
                    height: 50,
                }}
              />  
                <Text style = {styles.bookTitle}>Title: {item.title1}</Text>
                <Text>Author: {item.author1}</Text>
                <Text>Condition: {item.condition1}</Text>
                <Text>User: {item.username1}</Text>
                <Text>Contact:</Text> 
                <Button onPress={() => Linking.openURL(`mailto:${item.email1}?subject=${emailTitle}&x&change&&body=${emailBodyUser1}`) }
                title={item.email1} />
            </View>  
            ):(
            <View style={styles.bookContainer}>
                <Image
                  style={{
                      borderColor: 'black',
                      borderWidth: 2,
                      height: 100,
                      width: 100,
                  }}
                  source={{
                      uri: item.thumbnail2,
                      width: 50,
                      height: 50,
                  }}
                />
                <Text style = {styles.bookTitle}>Title:{item.title2}</Text>
                <Text>Author:{item.author2}</Text>
                <Text>Condition:{item.condition2}</Text>
                <Text>User:{item.username2}</Text>
                <Text>Contact:</Text>
                <Button onPress={() => Linking.openURL(`mailto:${item.email2}?subject=${emailTitle}&x&change&&body=${emailBodyUser2}`) }
                title={item.email2} />
            </View>
          )
            }
          </>  
            
            
            <View>
                <TouchableOpacity>
            <Button title="Confirm Exchange" onPress={() => setOpenModal(true)}/>
            <ReputationModal item={item} text='Rate your exchange!' buttonText='Close' visible={openModal} onClose={onClose}></ReputationModal>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Button 
                        title = 'cancel exchange'
                        onPress={()=>sendCancel(item)}
                        >Cancel</Button>
                </TouchableOpacity>
            </View>
        </View>
    );


}

export default ConfirmExchange;

const styles = StyleSheet.create({
    buttonContainer:{
      flexDirection: 'row'
    },
    root: {
      width: '100%',
      flex: 1,
      padding: 10,
      justifyContent: 'center',
      // backgroundColor:'green',
    },
    bookTitle:{
        fontWeight:'bold'
      },
    title: {
      alignSelf: 'flex-start',
      justifyContent: 'center',
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      
    },
    matchContainer:{
      width:'100%',
      justifyContent: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      textAlign: 'center',
      //backgroundColor:'red',
    }, 
    bookContainer: {
      //backgroundColor: 'D9D9D9',
      borderRadius: 5,
      height: 400,
      width: '100%',
      justifyContent: 'center',
      // flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff5cf',
  
    },
     item: {
      width: '100%',
    // flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 13,
      flexWrap: 'wrap',
      //backgroundColor:'blue',
     }, 
     text: {
      alignItems:'flex-start',
      justifyContent: 'center',
      fontSize: 20, 
      fontWeight: 'bold', 
      alignSelf: 'center'
     },
     app: {
      width: '100%',
      height: '100%',
      backgroundColor: 'blue',
      flex: 1,
      alignContent: 'center',
      justifyContent: 'center',
     }
     
  });