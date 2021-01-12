import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput,KeyboardAvoidingView,TouchableOpacity,Alert, ToastAndroid } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader'
import {Input, Icon} from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize';

export default class Exchange extends Component{

  constructor(){
    super()
    this.state = {
      userId : firebase.auth().currentUser.email,
      itemName : "",
      description : "",
      requestedItemName:"",
      exchangeId:"",
      itemStatus:"",
      docId: "",
      IsExchangeRequestActive: "",
      userDocId: "",
      dataSource: "",
      showFlatList: "",
      itemValue: "",
      currencyCode: ""
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addItem=(itemName, description)=>{
    var userName = this.state.userId;
    var exchangeId = this.createUniqueId();
    console.log(exchangeId)
    db.collection("exchange_requests").add({
      "username"    : userName,
      "item_name"   : itemName,
      "description" : description,
      "exchangeId"  : exchangeId,
      "item_status" : "requested",
      "item_value"  : this.state.itemValue,
      "date"        : firebase.firestore.FieldValue.serverTimestamp()
     })
     this.getExchangeRequest()
     db.collection('users').where("emailId","==",this.state.userId).get()
   .then()
   .then((snapshot)=>{
     snapshot.forEach((doc)=>{
       db.collection('users').doc(doc.id).update({
     IsExchangeRequestActive: true
     })
   })
 })
     this.setState({
       itemName : '',
       description :'',
       itemValue : ""
     })

     return Alert.alert(
          'Item ready to get exchanged.',
          '',
          [
            {text: 'OK', onPress: () => {

              this.props.navigation.navigate('HomeScreen');
            }}
          ]
      );
  }

  getIsExchangeRequestActive(){
    db.collection('users')
    .where('emailId','==',this.state.userId)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
          IsExchangeRequestActive:doc.data().IsExchangeRequestActive,
          userDocId : doc.id,
          currencyCode: doc.data().currency_code
        })
      })
    })
  }

  getExchangeRequest =()=>{
  var exchangeRequest=  db.collection('exchange_requests')
    .where('username','==',this.state.userId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().item_status !== "received"){
          this.setState({
            exchangeId : doc.data().exchangeId,
            requestedItemName: doc.data().item_name,
            itemStatus:doc.data().item_status,
            itemValue : doc.data().item_value,
            docId     : doc.id
          })
        }
      })
  })
}



componentDidMount(){
  this.getExchangeRequest()
  this.getIsExchangeRequestActive()
}

receivedItem=(itemName)=>{
  var userId = this.state.userName;
  var exchangeId = this.state.exchangeId;
  db.collection('received_items').add({
      "user_id": userId,
      "item_name":itemName,
      "exchange_id"  : exchangeId,
      "itemStatus"  : "received",

  })
}

updateExchangeRequestStatus=()=>{
  db.collection('exchange_requests').doc(this.state.docId)
  .update({
    item_status : 'recieved'
  })

  db.collection('users').where('emailId','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      db.collection('users').doc(doc.id).update({
        IsExchangeRequestActive: false
      })
    })
  })

}

sendNotification=()=>{
  //to get the first name and last name
  db.collection('users').where('emailId','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().firstName
      var last_name = doc.data().lastName

      // to get the donor id and item name
      db.collection('all_notifications').where('exchangeId','==',this.state.exchangeId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var itemName =  doc.data().item_name

          //targert user id is the donor id to send notification to the user
          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + last_name + " received the item " + itemName ,
            "notification_status" : "unread",
            "item_name" : itemName
          })
        })
      })
    })
  })
}

  render(){

    if (this.state.IsExchangeRequestActive === true){
      // status screen
      return(
        <View style = {{flex:1,justifyContent:'center'}}>
         <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:RFValue(10),margin:10}}>
         <Text>ITEM NAME</Text>
         <Text>{this.state.requestedItemName}</Text>
         </View>

         <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:RFValue(10),margin:10}}>
         <Text> Item Value </Text>

         <Text>{this.state.itemValue}</Text>
         </View>

         <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:RFValue(10),margin:10}}>
         <Text>ITEM STATUS</Text>

         <Text>{this.state.itemStatus}</Text>
         </View>

         <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
         onPress={()=>{
           this.sendNotification()
           this.updateExchangeRequestStatus();
           this.receivedItem(this.state.requestedItemName)
         }}>
         <Text>Wo hoo! I received the item.</Text>
         </TouchableOpacity>
       </View>
     )

    }
    else{
    return(
      <View style={{flex:1}}>
      <MyHeader title="Add Item"  navigation ={this.props.navigation}/>
      <KeyboardAvoidingView style={{flex:1,justifyContent:'center', alignItems:'center'}}>
        <Input
          style={styles.formTextInput}
          placeholder ={"Item Name"}
          label ={"Item Name"}
          onChangeText={(text)=>{
            this.setState({
              itemName: text
            })
          }}
          value={this.state.itemName}
        />
        <Input
          multiline
          numberOfLines={4}
          style={[styles.formTextInput,{height:RFValue(100)}]}
          placeholder ={"Description"}
          label ={"Description"}
          onChangeText={(text)=>{
            this.setState({
              description: text
            })
          }}
          value={this.state.description}
        />
        <Input
            style={styles.formTextInput}
            placeholder ={"Item Value"}
            label ={"Item Value"}
            maxLength ={8}
            onChangeText={(text)=>{
              this.setState({
                itemValue: text
              })
            }}
            value={this.state.itemValue}
          />

        <TouchableOpacity
          style={[styles.button,{marginTop:10}]}
          onPress = {()=>{this.addItem(this.state.itemName, this.state.description)}}
          >
          <Text style={{color:'#ffff', fontSize:18, fontWeight:'bold'}}>Add Item</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      </View>
    )
  }
}
}


const styles = StyleSheet.create({
  formTextInput:{
    width:"75%",
    height:RFValue(35),
    alignSelf:'center',
    borderColor:'#feab76',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:RFValue(10)
  },
  button:{
    width:"75%",
    height:RFValue(50),
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#fe5621",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },

})
