import * as React from 'react';
import {Text, View, StyleSheet, TextInput, 
TouchableOpacity,KeyboardAvoidingView, Alert} from 'react-native';
import db from '../config';
import {Header,Icon,Card,Input} from 'react-native-elements';
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize';

export default class ReceiverDetailsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      userId          : firebase.auth().currentUser.email,
      userName          :'',
      receiverId      : this.props.navigation.getParam('details')["username"],
      exchangeId       : this.props.navigation.getParam('details')["exchangeId"],
      itemName        : this.props.navigation.getParam('details')["item_name"],
      itemValue       : this.props.navigation.getParam('details')["item_value"],
      description  : this.props.navigation.getParam('details')["description"],
      receiverName    : '',
      receiverContact : '',
      receiverAddress : '',
      receiverRequestDocId : '',
      receiverCurrencyCode: "",
      donorCurrencyCode: "",
      exchangeValue: ""
    }
  }

  getData(){
    fetch("http://data.fixer.io/api/latest?access_key=458b07ca290d9b4e5db95e4de25f4efc&format=1")
    .then(response=>{
      return response.json();
    }).then(responseData =>{
      var receiverCurrencyCode = this.state.receiverCurrencyCode
      var donorCurrencyCode = this.state.donorCurrencyCode
      var currency = responseData.rates
      var receiverEuroEquivalentCurrencyCode = currency[receiverCurrencyCode]
      var receiverCostInEuro = this.state.itemValue / receiverEuroEquivalentCurrencyCode

      var donorEuroEquivalentCurrencyCode = currency[donorCurrencyCode]
      var donorCost = receiverCostInEuro * donorEuroEquivalentCurrencyCode

      var correctValue = donorCost.toFixed(2)
      var finalValue = correctValue + " " + donorCurrencyCode

      this.setState({
        exchangeValue: finalValue
      })

      var value =  69 / currency
      console.log(value);
    })
  }

  getUserDetails=(userId)=>{
      db.collection("users").where('emailId','==', userId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          console.log(doc.data().firstName);
          this.setState({
            userName  :doc.data().firstName + " " + doc.data().lastName,
            donorCurrencyCode: doc.data().currency_code
          })
        })
      })
    }


getReceiverDetails(){
  console.log("receiver ",this.state.receiverId);
  db.collection('users').where('emailId','==',this.state.receiverId).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      this.setState({
        receiverName    : doc.data().firstName,
        receiverContact : doc.data().contact,
        receiverAddress : doc.data().address,
        receiverCurrencyCode: doc.data().currency_code
      })
    })
  });

  db.collection('exchange_requests').where('exchangeId','==',this.state.exchangeId).get()
  .then(snapshot=>{
    snapshot.forEach(doc => {
      this.setState({receiverRequestDocId:doc.id})
   })
})}

updateBarterStatus=()=>{
  db.collection('all_barters').add({
    item_name           : this.state.itemName,
    exchange_id          : this.state.exchangeId,
    requested_by        : this.state.receiverName,
    donor_id            : this.state.userId,
    request_status      :  "Donor Interested"
  })
}



  addNotification=()=>{
    var message = this.state.userName + " has shown interest in exchanging the item";
    console.log(message);
    db.collection("all_notifications").add({
      "targeted_user_id"    : this.state.receiverId,
      "donor_id"            : this.state.userId,
      "exchangeId"          : this.state.exchangeId,
      "item_name"           : this.state.itemName,
      "date"                : firebase.firestore.FieldValue.serverTimestamp(),
      "notification_status" : "unread",
      "message"             : message
    })
  }



componentDidMount(){
  this.getReceiverDetails();
  this.getUserDetails(this.state.userId);
  this.getData();
}


  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <Header
            leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{ text:"Exchange Items", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
            backgroundColor = "#eaf8fe"
          />
        </View>
        <View style={{flex:0.2, marginTop: 15}}>
          <Card
              title={"ITEM INFORMATION"}
              titleStyle= {{fontSize : 15}}
            >
            <Card style = {{marginTop:- 15}}>
              <Text style={{fontWeight:'bold', fontSize: 10}}>Name : {this.state.itemName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold', fontSize: 10}}>Reason : {this.state.description}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold', fontSize: 10}}>Item Value : {this.state.exchangeValue}</Text>
            </Card>
          </Card>
        </View>
        <View style={{flex:0.2, marginTop: 195}}>
          <Card
            title={"RECEIVER INFORMATION"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text style={{fontWeight:'bold', fontSize: 10}}>Name : {this.state.receiverName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold', fontSize: 10}}>Contact : {this.state.receiverContact}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold', fontSize: 10}}>Address : {this.state.receiverAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.receiverId !== this.state.userId
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.updateBarterStatus();
                    this.addNotification();
                    this.props.navigation.navigate('MyBarters');
                  }}>
                <Text style = {{textSize: 10}}>Let's EXCHANGE !</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:30,
    marginTop: 295,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})