import React from "react";
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { MY_API_KEY } from '../config';

class MapContainer extends React.Component {
  componentDidMount() {
   
  }
  render() {
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={8}
          
          initialCenter={{ lat: 47.444, lng: -122.176}}
        />
        
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: MY_API_KEY
})(MapContainer);