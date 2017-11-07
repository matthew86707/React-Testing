import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './Timer.js'
import 'bootstrap/dist/css/bootstrap.css'
var $ = require('jquery');

class App extends Component {
  render() {
    return (
      <div className="App">
      <div className="container" style={{backgroundColor: 'lightGrey'}}>
      <br/>
        <div className="row">
    
        <PriceDisplay currency="BTC"> </PriceDisplay>
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



class PriceDisplay extends Component{
  constructor(props){
    super(props);
      this.props = props;
      this.state = {
        currentPrice : 0,
        deltaPrice : 0,
        trend : 'No Change'
      };
      this.divStyle = {
       color: 'black',
       fontSize : 50,
       paddingTop : 70
      };
      this.executeAjaxRequest = this.executeAjaxRequest.bind(this);
      setInterval(this.executeAjaxRequest, 8000);
    }
    executeAjaxRequest(e){
      $.ajax({
        url: 'https://api.coinmarketcap.com/v1/ticker/',
        indexValue : {theObject : this},
        success: function(data){
          var index = 0;
          for(var i = 0; i < data.length; i++){
            if(data[i].symbol === this.indexValue.theObject.props.currency){
              index = i;
              break;
            }
          }
          var delPrice = data[index].price_usd - this.indexValue.theObject.state.currentPrice;
          if(delPrice != 0){
          this.indexValue.theObject.setState({deltaPrice : delPrice});
        }
          if(delPrice < 0){
            this.indexValue.theObject.setState({trend : 'Negative Change'});
          }else if(delPrice > 0){
            this.indexValue.theObject.setState({trend : 'Positive Change'});
          }else{
            //this.indexValue.theObject.setState({trend : 'No Change'});
          }
          this.indexValue.theObject.setState({currentPrice : data[index].price_usd});
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
      <br/>
      <div style={this.divStyle}>${this.state.currentPrice}</div>
      </div>
      </div>
</div>
      );
  }
}

export default App;
