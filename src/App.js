import React from 'react';
 import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weight: 0,
      ip: "ws://10.10.2.206:7000/status"
    };
    this.setAdress = this.setAdress.bind(this);
    this.opennewwebsocket = this.opennewwebsocket.bind(this);
  }
  componentDidMount() {
    this.opennewwebsocket();
  }
  setAdress(event)
  {
    const value_set = event.target.value;
    const re = /ws:\/\/((1\d{2}|2[0-4]\d|25[0-5]|\d{1,2})\.){3}(1\d{2}|2[0-4]\d|25[0-5]|\d{1,2}):\d+\/[^\s]+/;
    if(re.test(value_set)) 
    {
     try { 
    this.connectionMass.close();
    this.setState({weight: 0});
     }
     catch(err)
     {
       console.log(err);
     }
    this.setState({ip: value_set});
    } 
  }
  opennewwebsocket()
  {    
    this.connectionMass = new WebSocket(this.state.ip);
      this.connectionMass.onopen =  () => {
        window.setInterval(() => {
          var msg = {
            COMMAND: "GET_MOD_INFO"
          }
          try {
            this.connectionMass.send(JSON.stringify(msg));
          }
          catch(err)
          {
            console.log(err);
          }
        }, 100)
      }
      this.connectionMass.onclose =  () => {
        setTimeout(this.opennewwebsocket,1000);
      }
      this.connectionMass.onmessage =  (evt) => {
        var msg = JSON.parse(evt.data);
        if(msg.Data.Mass[0].NetAct.Value === 'nie jest liczbą')
        {
          this.setState({weight: 0})
        }
        else 
        {
          this.setState({weight: msg.Data.Mass[0].NetAct.Value});
        }
      }
    
  }

  taring()
  {
        var msg = {
          COMMAND: "EXECUTE_ACTION",
          PARAM: "actTarring"
        }
        this.connectionMass.send(JSON.stringify(msg));
  }
  zeroing()
  {
      var msg = {
        COMMAND: "EXECUTE_ACTION",
        PARAM: "actZeroing"
      }
      this.connectionMass.send(JSON.stringify(msg));
  }
  render() {
    this.taring = this.taring.bind(this);
    this.zeroing = this.zeroing.bind(this);
    return (
        <div className="container-fluid">
          <nav className="navbar navbar-light bg-primary">
            <a className="navbar-brand text-white" href="#">WEBSOCKET</a>
            <a className="navbar-brand footer_text text-white"><span className="adress">Adres Websocket</span><input className="ip" placeholder="IP WEBSOCKET" onKeyPress={this.setAdress}/></a>
          </nav>
          <section className="row">
            <div className="col-2 col-sm-4 offset-sm-1 col-md-5 mt-5 col-6 weight col-xl-3 col-lg-2 offset-lg-4  offset-xl-5">
                {this.state.weight}
            </div>
          </section>
          <section className="row">
            <section className="col-3  col-md-2 tare offset-md-4 mt-3 col-xl-2 offset-xl-4" onClick={this.taring}>
              <p className="tare-p">TARUJ</p>
            </section>
            <section className="col-3 col-md-2 ml-5 zeroing mt-3" onClick={this.zeroing}>
              <p className="zeroing-p">ZERUJ</p>
            </section>
          </section>
          <nav className="navbar navbar-light footer bg-primary">
            <a className="navbar-brand footer_text text-white" href="#">RADWAG</a>
          </nav>
        </div>
    );
  }
}
export default App;