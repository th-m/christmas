import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as fire from './firebase';

class WishList extends Component {
  render(){
    return(
          <div>
            <div className='column'>
              <div className='row'>
                <input placeholder="Type a things" onChange={this.props.handleText('thing')} value={this.props.thing}/>
                <button onClick={this.props.addThing}> I want this thing! </button>
              </div>
              <Things things={this.props.things} color="red" editable={true} user={this.props.user}/>
            </div>
          </div>
    )
  }
}

const Things = props => {
  const editable = props.editable ? "editable" : "";
  const remove = key => () => {
    if(!props.user) return false;
    fire.remove(`/families/valadez/${props.user}/things/${key}`);
  }
  return(
    <div className={`things column ${props.color}`}>
      {Object.keys(props.things).map(thing => <ul key={thing} >{props.things[thing]} <span className={editable} onClick={remove(thing)}>x</span></ul>)}
    </div>
  )
}

class Beneficiary extends Component {
  state = {
    things: {}
  }

  gotThings = data => {
    if(!data.val()) return   this.setState({ things : {} });;
    this.setState({ things : data.val() });
  }
  
  errData = (error) => {
    console.log("errData", error);
  }

  componentDidMount(){
    fire.listen(`/families/valadez/${this.props.name}/things`).on("value", this.gotThings, this.errData);
  }

  render(){
    return(
      <div>
        <div className='column'>
            <h4>
              You have {this.props.name}, and {this.props.name} wants
            </h4>
            <div>
              <Things things={this.state.things} color="green" editable={false}/>
            </div>
        </div>
      </div>
    )
  }
}

class App extends Component {
  state={
    user: null,
    thing: "",
    beneficiary: null,
    things: [] 
  }

  handleText = key => e => {
    this.setState({[key]: e.target.value.toLowerCase()});
  }

  gotThings = data => {
    if(!data.val()) return   this.setState({ things : {} });;
    this.setState({ things : data.val() });
  }
  
  errData = (error) => {
    console.log("errData", error);
  }

  getInfo = () => {
    fire.listen(`/families/valadez/${this.state.user}/things`).on("value", this.gotThings, this.errData);
   
    fire.get(`/families/valadez/${this.state.user}/has`).then( x => {
      this.setState({beneficiary: x});;
    })
  }

  addThing = () => {
    fire.push(`/families/valadez/${this.state.user}/things`, this.state.thing);
    this.setState({thing:""});
  }
  
  render() {
    return (
      <div className="App">
        <h3>
          Secret-Santanator 3000
        </h3>
        
        {
          this.state.user && this.state.beneficiary
          ?<div className='split'>
            <Beneficiary name={this.state.beneficiary} />
            <WishList handleText={this.handleText} addThing={this.addThing} thing={this.state.thing} things={this.state.things} user={this.state.user}/>
          </div>
          :<div>
            <div className='row start'>
              <input placeholder="Enter your name" onChange={this.handleText('user')} />
              <button onClick={this.getInfo}> See beneficiary! </button>
            </div>
          </div>
        }
        
      </div>
    );
  }
}

export default App;



