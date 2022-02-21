import React from 'react';
import {ThetaDropConnect} from '@thetalabs/theta-drop-connect';
import './App.css';

// ThetaZilla AppId
// const AppId = 'dapp_8gsf5446h44rsrpyun0pu5qqztm';
// SPS AppId
const AppId = 'dapp_407nzp9ggfqr5wy3tna7111rdq1'; 
const redirectURL = 'http://localhost:3010/thetadrop-auth-finished.html';

const ThetaZillaMarketplaceUrl = 'https://symbiote.thetadrop.com/marketplace?content_creator=user_hq8vr83j3x6zry8g274qzb41jca';
const Collision = 'type_8xhxfbp9b83m9fb5hwukqy99jfh';
const Synergy = 'type_xi85tzu5igyxujswyxezrreqew4';
const The_Architect = 'type_c8jtmgs9b1z2kw8vniv3ynff0sc';
const Fuse = 'type_hsihbk1jvsdi16x5qka5asthhmp';
const Vault = 'pack_fc23sf2ka9b5g198ajedikdm47d';
const Theta_Verse = 'type_ysk9wr77wt05ydfu7bxutvxdz80';
const Metal_Print = 'type_zwwezd5w7fc4i8x13d1yb0xa2bq';
const Symbiote = [Collision,Synergy,The_Architect,Fuse,Vault,Theta_Verse,Metal_Print];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.thetaDrop = new ThetaDropConnect();

    this.state = {
      isOwner: false
    }
  }

  componentDidMount() {
    // Optional: Use only if using the redirect option
    this.finishConnectViaRedirect();
  }

  finishConnectViaRedirect = async () => {
    const result =  await this.thetaDrop.finishConnectViaRedirect();

    if(result){
      const {snsId, oauth2Token} = result;

      this.setState({
        tpsId: snsId,
        authToken: oauth2Token
      });

      this.refreshUser();
      this.refreshOwnershipChecks();
    }
  }

  refreshOwnershipChecks = async () => {
    const filters = {
      content_id: Symbiote
    };
    await this.thetaDrop.fetchUserNFTs(filters);

    const isOwner = await this.thetaDrop.checkUserIsOwner(filters);

    this.setState({
      isOwner: isOwner
    });
  }

  refreshUser = async () => {
    const userData = await this.thetaDrop.fetchUser();

    this.setState({
      userData: userData
    });
  }

  connectToThetaDrop = async () => {
    const {snsId, oauth2Token} = await this.thetaDrop.connectViaPopup(AppId, redirectURL);

    this.setState({
      tpsId: snsId,
      authToken: oauth2Token
    });

    this.refreshUser();
    this.refreshOwnershipChecks();
  };

  connectToThetaDropViaRedirect = async () => {
    const hostUri = 'http://localhost:3010/';
    this.thetaDrop.connectViaRedirect(AppId, hostUri);
  };

  render(){
    const {userData, isOwner} = this.state;

    return (
        <div className="App">
          <header className="App-header">
            <h2>
              ThetaDrop Connect Playground
            </h2>

            {
              userData &&
              <div>
                <div style={{marginBottom: 12}}>Logged in as:</div>
                <img src={userData.avatar_url}
                     style={{width: 100}}
                />
                <div style={{fontSize: 12}}>{userData.display_name}</div>
                  <div style={{fontSize: 10}}>{`@${userData.username}`}</div>
              </div>
            }

            {
              userData === undefined &&
              <div>
                <h3>Connect to ThetaDrop</h3>
                <p>Login to connect</p>
                <button onClick={this.connectToThetaDrop}>Login to ThetaDrop via Popup</button>
                <button onClick={this.connectToThetaDropViaRedirect}>Login to ThetaDrop via Redirect</button>
              </div>
            }

            {
              userData !== undefined && !isOwner &&
              <div>
                <h3>Sorry...Owners Only Area</h3>
                <a href={ThetaZillaMarketplaceUrl} target={'_blank'}>Buy a ThetaZilla</a>
              </div>
            }

            {
              isOwner &&
              <div>
                <h3>Owners Only Area</h3>
                <button onClick={() => {
                  alert('Hello Owner :)')
                }}>Owners Only Lounge</button>
              </div>
            }

          </header>
        </div>
    );
  }
}

export default App;
