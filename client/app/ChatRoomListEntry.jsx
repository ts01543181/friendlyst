import React, { Component } from 'react'
import $ from 'jquery'
import MessageList from './MessageList.jsx'

class ChatRoomListEntry extends Component {
  constructor() {
    super()
    this.state = {
      value: '',
      messages: []
    }
  }

  
  componentDidMount() {
    this.props.room.mainUser.on('private message received', msg => {
      this.setState({
        messages: [...this.state.messages, msg]
      })
    })
  }

  sendPrivateMessage() {
    // grab only the friend username and user this.props.socket to emit message (?)

    let msg = {
      msg: this.state.value,
      to: this.props.room.friend,
      from: this.props.room.mainUser.nickname
    }
    
    this.props.room.mainUser.emit('private message', msg)
    
    if (msg.to === msg.from) {
      return
    } 

    this.setState({
        messages: [...this.state.messages, msg]
    })
  }

  closeCurrentRoom() {
    let room = {
      friend: this.props.room.friend,
      mainUser: this.props.room.mainUser
    }

    this.props.closeRoom(room)
  }

  setVal(val) {
    this.setState({
      value: val
    })
  }

  render() {
    return (
    <div className="chatroom">
        <span>Chat with {this.props.room.friend}</span><button onClick={this.closeCurrentRoom.bind(this)}>x</button>
        

        <div className="private-message-area">
           <MessageList messages={this.state.messages} friend={this.props.room.friend} mainUser={this.props.room.mainUser}/> 
        </div>

        <div className="chatroom-inputs">
          <input type="text" onChange={(e) => this.setVal(e.target.value)}/>
          <button onClick={this.sendPrivateMessage.bind(this)}>Send</button>
        </div>
      </div>
    )
  }
}

export default ChatRoomListEntry