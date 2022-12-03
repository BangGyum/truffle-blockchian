import React, { Component } from "react";
// import CounterContract from "./contracts/Counter.json";

import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import Kyc from "./contracts/KycContract.json";
import "./App.css";
import getWeb3 from "./getWeb3";


class App extends Component {
  //state = {loaded:false, count: 0, accounts: null, contract: null };
  state = { loaded:false, kycAddress:"0x123...", tokenSaleAddress : null,tokenAddress : null ,userTokens:0 }; //앱 로딩상태 확인, 처음은 false

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();
      //스토리지나 스테이트 변수가 아닌, 클래스 변수

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
    
      //밑에가 instance 인듯
      //  this.counter = new this.web3.eth.Contract(
      //    CounterContract.abi,  CounterContract.networks[this.networkId] &&  CounterContract.networks[this.networkId].address
      this.tokenInstance = new this.web3.eth.Contract(
          MyToken.abi
          , MyToken.networks[this.networkId] &&  MyToken.networks[this.networkId].address
      );
      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi
        , MyTokenSale.networks[this.networkId] &&  MyTokenSale.networks[this.networkId].address
      );
      this.kycInstance = new this.web3.eth.Contract(
        Kyc.abi
        , Kyc.networks[this.networkId] &&  Kyc.networks[this.networkId].address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded:true,
             tokenSaleAddress : MyTokenSale.networks[this.networkId].address ,
            } ,this.updateUserTokens );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
 //우리는 단순 스토리지 계약을 위한 거라 
  runExample = async () => {
    // Get the value from the contract to prove it worked.
    //const response = await this.counter.methods.ViewCount().call();
    // Update state with the result.
    //this.setState({count: response})
    this.setState({})
  };

  handleIncrease = async() => {
    await this.counter.methods.IncrementCount().send({ from: this.accounts[0] })
    await this.runExample()
  }

  handleReduce = async() => {
    await this.counter.methods.DecrementCount().send({ from: this.accounts[0] })
    await this.runExample()
  }

  HandleInputChange = (event) => {
    const target = event.target; //이벤트 타켓 가져옴
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
    //우리코드엔 체크박스 없지만 걍 일반적 기능임
  }
  handleBuyTokens = async() => {
    await this.tokenInstance.methods.buyTokens(this.accounts[0]).send({
          from: this.accounts[0], value: this.web3.utils.toWei("1","wei")});
  }

  updateUserTokens = async() => {
    let userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call() ; //call은 읽기, send는 쓰기
    this.setState({userTokens: userTokens});
  }
  
  handleKycWhitelisting=async() => { //Kyc 게약을 가져옴, KycContract의 setKycCompleted 호출
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]});
    alert("KYC for " + this.state.kycAddress +"is completed");

  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Count...</div>;
    }
    return (
      <div className="App">
        <h1>StarDucks Cappucino Token Sale</h1>
        <p>Get your Tokens Today!</p>
        <h2>Kyc WhiteListing</h2>
        Address to allow: 
        <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.HandleInputChange} />
        <p>value가 흥미롭대, state 외부로 아직 정의하지 않아서</p>
        <p>HandleInputChange</p>
        <button type="button" onClick={this.handleKycWhitelisting}>Add to Whitelist</button>
        <p>if you want to buy tokens, send Wei to this address: {this.state.tokenSaleAddress}</p>
        <p>a{this.state.tokenSaleAddress}</p>
        <p>You currently have: {this.state.userTokens} CAPPU tokens</p>
        <button type="button">Buy more tokens</button>
      </div>
    );
  }
}

export default App;
