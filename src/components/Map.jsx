import React from 'react';
import VectorMap from '@south-paw/react-vector-maps';
import styled from '@emotion/styled';
import world from '@south-paw/react-vector-maps/maps/json/world.json';
import styledComponent from 'styled-components';
import perc2color from './colorPicker';

import PMData  from '../assets/PM.json';

import { StyledMap } from './svgMap/styled.js';


class MyMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: null,
      focused: null,
      clicked: null,
      data: [],
      PM: [],
      PMColors: []
    };
  }

  componentDidMount() {
    // console.log(PMData);
    const data = [];
    const PMColors= [];
    // console.log('PMda', PMData);
    // console.log('world', world);
    
    PMData.map(country => {
      const countryData = {};
      countryData['name'] = country.country;
      const PM = {
        2008: country['PME.2008'],
        2009: country['PME.2009'],
        2010: country['PME.2010'],
        2011: country['PME.2011'],
        2012: country['PME.2012'],
        2013: country['PME.2013'],
        2014: country['PME.2014'],
        2015: country['PME.2015'],
      }
      countryData['PM'] = PM;
      data.push(countryData);
    });

    data.map(el => {
      const country = {}
      const color = perc2color(el.PM[2008]);
      country['name'] = el.name;
      country['color'] = color;
      // const element = document.querySelectorAll(`[name=${el.name}]`);
      // console.log(element); 
      PMColors.push(country)
    });

    // console.log(PMColors);

    const El = document.getElementById('world');

    [...El.childNodes].map(el => {
      PMColors.map(country => {
        if (country.name === el.attributes.name.value) {
          el.fill = country.color
        }
      })
    })
    
    

    this.setState({ data, PMColors });
    
  }

  /** When the mouse enters a layer. */
  onMouseEnter = e => this.setState({ hovered: e.target.attributes.name.value });

  /** When the mouse leaves a layer. */
  onMouseLeave = () => this.setState({ hovered: null });

  /** When a layer gains focus. */
  onFocus = e => this.setState({ focused: e.target.attributes.name.value });

  /** When a layer looses focus. */
  onBlur = () => this.setState({ focused: null });

  /** When a layer is clicked. */
  onClick = e => console.log(e.target.attributes);
  ;

  render() {
    const { hovered, focused, clicked, PMColors } = this.state;

    let layers;

    console.log(world);
    

    // if (PMColors.length) {
    //   layers = PMColors.map(el => {
    //     console.log(el);
    //     if (el.name && el.color) {
    //       return styledComponent`
    //       path {
    //         &[aria-name=${el.name}] {
    //           fill: ${el.color};
    //         }
    //       `
    //     }
    //   });
    // }
    
    // console.log(layers);

    const layerProps = {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onClick: this.onClick,
    };
    return (
      <div className="map-container">
        {/* <StyledMap> */}
        <StyledMap>
          <VectorMap {...world} layerProps={layerProps} />
        </StyledMap>
        {/* </StyledMap> */}
      </div>
    );
  }
}

export default MyMap;