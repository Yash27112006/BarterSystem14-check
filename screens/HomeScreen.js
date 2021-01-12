import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import MyHeader from '../components/MyHeader';

import db from '../config';
import {Input, Icon} from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize';

export default class HomeScreen extends Component{
  constructor(){
    super()
    this.state = {
      allRequests : []
    }
  this.requestRef= null
  }

  getAllRequests =()=>{
    this.requestRef = db.collection("exchange_requests")
    .onSnapshot((snapshot)=>{
      var allRequests = []
      snapshot.forEach((doc) => {
          allRequests.push(doc.data())
      })
      this.setState({allRequests:allRequests})
    })
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    console.log(item.username)
    return (
      <ListItem
        key={i}
        title={item.item_name}
        subtitle={item.description}
        description ={item.item_value}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={styles.button}
            onPress ={()=>{
               this.props.navigation.navigate("ReceiverDetails",{"details": item});
             console.log("This is the item ",item.username)}}>
              <Text style={{color:'#ffff'}}>Check</Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  componentDidMount(){
    this.getAllRequests()
  }

  componentWillUnmount(){
    //this.requestRef();
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Barter App"  navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.allRequests.length === 0
            ?(
              <View style={{flex:1, fontSize: RFValue(20), justifyContent:'center', alignItems:'center'}}>
                <Text style={{ fontSize: RFValue(20)}}>List of all Barter</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allRequests}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  button:{
    width:RFValue(100),
    height:RFValue(30),
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff4721",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})