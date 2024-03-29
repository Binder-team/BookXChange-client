// import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { Platform, StyleSheet,Image, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookCard from '../components/BookCard';
import { Book } from '../types';
import { getUsername } from '../components/userTokenManager';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { Card } from 'react-native-paper';
import ConfirmExchange from '../components/ConfirmExchange';
import { RootStackParamList } from '../types';
export type Props = {
  book: Book,
  BookItem: Function,
  ConfirmExchange: Function
}

export default function MatchScreen({ navigation }) {
  const [acceptTrade, setAcceptTrade] = useState<boolean>(false);
  const [matchedBooks, setMatchedBooks] = useState<[]>([]);
  const [alteredArray, setAlteredArray] = useState<[]>(matchedBooks);
  const [currentView, setCurrentView] = useState<string>("all matches");
  const [numberMatches, setNumberMatches] = useState<number>();
  // const [rerender, setRerender] = useState<number>();
  let counter = 0;

  const [item, setItem] = useState({
    thumbnail1:'',
    title1: '',
    author1: '',
    condition1: '',
    username1: '',
    email1: '',
    thumbnail2:'',
    title2: '',
    author2: '',
    condition2: '',
    username2: '',
    email2: ''
})
  const getMatchedBooks = async () => {
    try {
      const fetchMatch = await axios.get(
          `https://binderapp-server.herokuapp.com/api/matches/${getUsername()}`,
          );
          const matches = await fetchMatch.data;
          console.log("how many matches: ",matches.length);
          setMatchedBooks(matches);
        } catch (err)  {
        console.log(err);  
      } 
  }
 

  const sendAccept = async (item) => {
    try {
      const put = await axios.put(
        `https://binderapp-server.herokuapp.com/api/matches/accept/user/${getUsername()}`, item
      );
      console.log(item);
      const data = put.data;
      setAcceptTrade(true);
      // setRerender(data);
      console.log("✨data:", data);
    } catch (err) {
      console.log(err);
    }
  }  
  
  const sendCancel = async (item) => {
    try {
      
      const put = await axios.put(
        `https://binderapp-server.herokuapp.com/api/matches/deny/user/${getUsername()}`, item
      );
      const data = put.data;
      console.log("cancelled exchange")
      counter++;
      setNumberMatches(data);
      const index = matchedBooks.indexOf(item);
      const removed = matchedBooks.splice(index, 1)
      setMatchedBooks([...removed]);
        
      // setRerender(data);
    } catch (err) {
      console.log(err);
    }
  }
  
  
  useEffect(() => {
    getMatchedBooks();
  },[]);

  // useEffect(() => {
  //   getMatchedBooks();
  // },[counter])

  const tradeCard = ({ item }) => (
    <View style={styles.item}>
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
        <Text style = {styles.bookTitle}>Title:{item.title1}</Text>
        <Text>Author:{item.author1}</Text>
        <Text>Condition:{item.condition1}</Text>
        <Text>User:{item.username1}</Text>
        <Text>accepted?: {`${item.didUser1Accept}`}</Text>
        <Text>exhanged?: {`${item.didUser1Exchange}`}</Text>
        {/* <Text>Contact:{item.email1}</Text>  */}
      </View>  
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
        <Text>accepted?: {`${item.didUser2Accept}`}</Text>
        <Text>exhanged?: {`${item.didUser2Exchange}`}</Text>
        {/* <Text>Contact:{item.email2}</Text> */}
      </View>
        <View style = {styles.buttonContainer}>
          <TouchableOpacity>
            {item.didUser1Accept && item.didUser2Accept 
            ? (<Button 
                title="see contact details"
                onPress={()=>{
                  setCurrentView("confirm exchange view")
                  setItem(item)
                }}
              >
              </Button>
            ) : (
              <Button 
                title="accept"
                onPress={()=>{
                  setAcceptTrade(true)
                  sendAccept(item)
                  }
                }
              > 
              </Button>
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Button 
            title="deny"
            onPress={()=>{
              sendCancel(item)
              console.log("array index: ",matchedBooks.indexOf(item))
            }}
            >Deny</Button>
          </TouchableOpacity>
        </View>
    </View>
  );


  const itemSeparator = () => {
    return <View style={styles.separator} />;
  };
//ternary operator: if accepted button is pressed, setAcceptTrade(true), then
//{ConfirmExchange} card, else, {tradeCard}
  
  return (
    <SafeAreaView style={styles.root}>
      {/* <View>
          <Text style={styles.text}>Your matches</Text>
      </View> */}
        {/* <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={styles.button}>
              <TouchableOpacity  onPress={() => setCurrentView("all matches")}>
              <Text>Matches</Text>       
              </TouchableOpacity>         
            </View>      
            <View  style={styles.button}>
              <TouchableOpacity  onPress={() =>setCurrentView("confirm exchange view")} >
                <Text>Exchanges</Text>
              </TouchableOpacity>
            </View>
        </View> */}
      <View style= {styles.matchContainer}>
        <View>
          {currentView === "all matches"? ( 
            <View>
              <Text title = "matches" style = {styles.title}>Your matches:</Text>
                <FlatList
                  data={matchedBooks}
                  renderItem={tradeCard}  
                  extraData={matchedBooks}
                  ItemSeparatorComponent={itemSeparator}
                />            
                
            </View>
      
          ):(
            <View>
              <Text title = "confirm exchange" style = {styles.title}>Confirm your exchange</Text>
               <ConfirmExchange
                  item = {item}
                  setCurrentView = {setCurrentView}
            />
            </View>
             
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}





const styles = StyleSheet.create({
  bookTitle:{
    fontWeight:'bold'
  },
  buttonContainer:{
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    width: '100%', 
    height: 40,
    backgroundColor: '#5B8B8B',
    padding: 10,
    alignItems: 'center',
    borderRadius:15
  },
  root: {
    width: '100%',
    height: '100%',
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    backgroundColor:'#ffeebf',
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
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    textAlign: 'center',
    backgroundColor:'#f5e6ff',
  }, 
  bookContainer: {
    //backgroundColor: 'D9D9D9',
    borderRadius: 20,
    // height: 300,
    width: '50%',
    justifyContent: 'center',
    // flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'yellow',

  },
   item: {
    width: '100%',
    flexDirection: 'row',
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
   }
   
});
