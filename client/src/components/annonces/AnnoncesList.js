import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Search from './Search';


class AnnonceList extends Component {
    state = { 
      listOfAnnonces: [],
      queryAddress:'',
      queryMoving: '',
      queryStartDate:'',
      queryEndDate:''

     }

    getAllAnnonces = () =>{
        axios.get(`http://localhost:5000/annonce`)
        .then(responseFromApi => {
            this.setState({
            listOfAnnonces: responseFromApi.data
            })
        })
        .catch(err => console.log('Error while fetching projects', err))
    }

    componentDidMount() {
      this.getAllAnnonces();
    }

    updateQueryAddress = (newValue) => {
      this.setState({queryAddress:newValue})
    }
  
    updateQueryMoving = (newValue) => {
      this.setState({queryMoving:newValue})
    }
    updateQueryStartDate = (newValue) => {
      this.setState({queryStartDate: newValue})
    }
    updateQueryEndDate = (newValue) => {
      this.setState({queryEndDate: newValue})
    }

  render(){
    let listOfAnnonncesFilter;
    if (this.props.location?.query) {
      listOfAnnonncesFilter = this.state.listOfAnnonces.filter(annonce =>{
        const matchAddress = annonce.adress.toLowerCase().includes(this.props.location.query);
        return matchAddress
      } )
    } else {
      listOfAnnonncesFilter = this.state.listOfAnnonces.filter(annonce =>{
        const matchAddress = annonce.adress.toLowerCase().includes(this.state.queryAddress);
        return matchAddress
      })
      if(this.state.queryMoving === "true" || this.state.queryMoving === "false") {
        listOfAnnonncesFilter = listOfAnnonncesFilter.filter(annonce => annonce.moving === this.state.queryMoving)
      }
    }
    
    
                                                           
    console.log('query:  ', this.state.queryAddress, this.state.queryMoving, this.state.queryEndDate, this.state.queryStartDate)
   
    return(
      <div>
        <Search updateQueryAddress={this.updateQueryAddress} 
                updateQueryMoving={this.updateQueryMoving} 
                updateQueryStartDate={this.updateQueryStartDate}
                updateQueryEndDate= {this.updateQueryEndDate}
                redirectToAnnonceList={this.redirectToAnnonceList}
        />
        <div style={{width: '60%', float:"left"}}>
          { listOfAnnonncesFilter.map( annonce => (
              <div key={annonce._id}>
                <Link to={`/annonce/${annonce._id}`}>
                  <img  src={annonce.imageUrl} style={{width: "300px"}} alt="" / >
                </Link>
            
                <p>{annonce.title}</p>
                <p>Type: {annonce.type === "offer" ? "Offer" : "Chercher un(e) bénévol(e)"}</p>
                <p>Période: De {annonce.startDate} A {annonce.endDate}</p>
                <p>Adresse: {annonce.adress}</p>
                <div>
                  <p>Auteur: {annonce.author.username}</p>
                  <Link to={`/profile/${annonce.author._id}`}>Voir Profil</Link>
                  <Link to={`/send-messages/${annonce._id}`}>Envoyer Messages</Link>
                </div>  
              </div>
            ))
          }
        </div>
        <div>
          {this.props.userInSession && <Link to="/annonce/new">Ajouter votre annonce</Link>}
        </div>
    
      </div>
    )
  }
}

export default AnnonceList;