import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './Timer.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'animate.css/animate.css'
var $ = require('jquery');

class App extends Component {
  render() {
    return (
      <div className="App">
      <div className="container" style={{backgroundColor: 'lightGrey'}}>
      <br/>
        <div className="row">
        <PriceDisplay currency="BTC" className="animated infinite flash"> </PriceDisplay>
        <PriceDisplay currency="ETH"> </PriceDisplay>
        <PriceDisplay currency="DOGE"> </PriceDisplay>
        <PriceDisplay currency="LTC"> </PriceDisplay>
        <PriceDisplay currency="DASH"> </PriceDisplay>
      </div>
      </div>
      </div>
    );
  }
}

class CurrencySupplyDisplay extends Component{
  constructor(props){
    super(props);
    this.props = props;
  }
  render(){
    return(
      <div className="row">
        {this.props.currency}
        <i class="material-icons">keyboard_arrow_down</i>
      </div>
    )
  }
}

class PriceDisplay extends Component{
  constructor(props){
    super(props);
      this.props = props;
      this.state = {
        currentPrice : 0,
        deltaPrice : 0,
        trend : 'No Change',
        isFirstUpdate : true
      };
      this.divStyle = {
       color: 'black',
       fontSize : 50,
       paddingTop : 70
      };
      this.executeAjaxRequest = this.executeAjaxRequest.bind(this);
    }
    componentDidMount() {
      this.interval = setInterval(this.executeAjaxRequest, 8000);
    } 
    componentWillUnmount() {
      clearInterval(this.interval);
    }
    executeAjaxRequest(e){
      var t = this;
      $.ajax({
        url: 'https://api.coinmarketcap.com/v1/ticker/',
        indexValue : {theObject : this},
        success: function(data){
          var index = 0;
          for(var i = 0; i < data.length; i++){
            if(data[i].symbol === t.props.currency){
              index = i;
              break;
            }
          }
          if(!t.state.isFirstUpdate){
          var delPrice = data[index].price_usd - t.state.currentPrice;
          if(delPrice != 0){
          t.setState({deltaPrice : delPrice});
          }
          if(delPrice < 0){
            t.setState({trend : 'Negative Change'});
          }else if(delPrice > 0){
            t.setState({trend : 'Positive Change'});
          }
          }else{
            t.setState({isFirstUpdate : false});
          }
          t.setState({currentPrice : data[index].price_usd});
        }
        ,
        dataType: 'json'
      });
    }
    render(){
      return(
      <div className="col-md-4">
        <div class="panel panel-default">
          <div class="panel-body">
            <h2> {this.props.currency} </h2>
            <h4> {this.state.trend} </h4>
            <h4> ({this.state.deltaPrice}) </h4>
            <CurrencySupplyDisplay currency={this.props.currency}> </CurrencySupplyDisplay>
            <br/>
            <div style={this.divStyle}>${this.state.currentPrice}</div>
          </div>
        </div>
      </div>
      );
  }
}

export default App;
