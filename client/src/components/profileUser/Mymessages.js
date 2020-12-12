import React from 'react';
import {Link} from 'react-router-dom'
import service from '../auth/auth-service';
import './ProfileUser.css';

import MenuProfile from "./MenuProfile";
class MyMessages extends React.Component {
    state={
        messages: [],
        addMessage: ''
    }

    getMessages = () => {
        const { params } = this.props.match;
        service.get(`/message/find/${params.id}`)
        .then(responseFromApi => {
            this.setState({
                messages: responseFromApi.data
            })
        })
        .catch(err => console.log('Error while fetching projects', err))
    }
    componentDidMount () {
        this.getMessages();
    }

    handleChange = (event) => {  
        const {name, value} = event.target;
        this.setState({[name]: value});
      }

    handleFormSubmit = (event) => {
    event.preventDefault();
    const {addMessage} = this.state
    
    service.post("/annonce", { addMessage })
        .then( () => {
        this.setState({addMessage:''});
        })
        .catch( error => console.log(error) )
    }

    render () {
        if(!this.props.userInSession) {
            return "Vous devez s'identifier afin de consulter vos messages !!"
        }
        return (
            <div className="container">
                <div className="profile row">   
                    <div className="menu col-lg-3">
                        <MenuProfile userInSession={this.props.userInSession}/>
                    </div>
                    
                    <div className="my-messages col-lg-6">
                        { this.state.messages.map( message => {
                            return (
                            <div key={message._id} className="messagesSection">
                                <div className="displayName">
                                    <Link to={`/profile/myProfile/${this.props.userInSession._id}/message/${message._id}`}>{message.sender._id === this.props.userInSession._id ? message.receiver.username : message.sender.username}</Link>
                                </div>
                                <div className="displayMessages">
                                    <div >
                                        {message.annonce ? <p>Pour: {message.annonce.title}</p> : <p>Pour: Annonce supprimée</p>}
                                        <p>{message.messagesBox[message.messagesBox.length-1].message}</p>
                                    </div>
                                </div>
                    
                            </div>
                            )})
                        }
                    </div>
                
            </div>
            </div>
            
        )
    }
}

export default MyMessages;