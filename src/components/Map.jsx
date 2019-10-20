import React from "react";
import VectorMap from "@south-paw/react-vector-maps";
import styled from "@emotion/styled";
import world from "@south-paw/react-vector-maps/maps/json/world.json";
import styledComponent from "styled-components";
import perc2color from "./colorPicker";

import { InfoIcon } from "./svgMap/infoIcon";

import PMData from "../assets/PM.json";
import COData from "../assets/CO.json";
import combined from "../assets/combined.json";

import top from "../assets/top.json";

import { StyledMap } from "./svgMap/styled.js";

class MyMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: null,
      focused: null,
      clicked: null,
      data: [],
      PM: [],
      PMColors: {},
      countryInfo: {},
      currentYear: 2009,
      topC: []
    };
  }

  componentDidMount() {
    const topC = [];
    // console.log(PMData);
    console.log(combined);
    console.log("top, ", top);

    top.map(el => {
      const country = {};
      country["name"] = el.country;
      country["co"] = el["CEH.2005"];
      topC.push(country);
    });

    this.setState({ topC });

    const data = [];
    const PMColors = [];
    // console.log('PMda', PMData);
    // console.log('world', world);

    combined.map(country => {
      const countryData = {};
      countryData["name"] = country.country;
      const PM = {
        2008: country["PME.2008"],
        2009: country["PME.2009"],
        2010: country["PME.2010"],
        2011: country["PME.2011"],
        2012: country["PME.2012"],
        2013: country["PME.2013"],
        2014: country["PME.2014"],
        2015: country["PME.2015"]
      };
      const CM = {
        2009: country["CEH.2009"]
      };
      countryData["PM"] = PM;
      countryData["CM"] = CM;
      data.push(countryData);
    });

    data.map(el => {});

    data.map(el => {
      const country = {};
      const color = perc2color(el.PM[2008]);
      PMColors[el.name] = color;
      // country['color'] = color;
      // const element = document.querySelectorAll(`[name=${el.name}]`);
      // console.log(element);
      // PMColors.push(country)
    });

    let worst = data.sort(
      (a, b) => a.PM[this.state.currentYear] > b.PM[this.state.currentYear]
    );

    worst = worst.slice(0, 10);

    this.setState({ worst });

    // console.log(PMColors);

    // const El = document.getElementById('world');

    // [...El.childNodes].map(el => {
    //   if (PMColors[el.attributes.name.value]) el.fill = 'red';
    //   console.log(PMColors[el.attributes.name.value]);

    //   // PMColors.map(country => {
    //   //   console.log(country.name, el.attributes.name.value);
    //   //   if (country.name === el.attributes.name.value) {

    //   //     el.fill = country.color
    //   //   }
    //   // })
    // })

    this.setState({ data, PMColors });
  }

  /** When the mouse enters a layer. */
  onMouseEnter = e =>
    this.setState({ hovered: e.target.attributes.name.value });

  /** When the mouse leaves a layer. */
  onMouseLeave = () => this.setState({ hovered: null });

  /** When a layer gains focus. */
  onFocus = e => this.setState({ focused: e.target.attributes.name.value });

  /** When a layer looses focus. */
  onBlur = () => this.setState({ focused: null });

  /** When a layer is clicked. */
  onClick = e => {
    const countryInfo = {};
    const name = e.target.attributes.name.value;
    countryInfo["name"] = name;
    const { data, currentYear } = this.state;
    data.map(el => {
      if (el.name === name) {
        countryInfo["pm"] = el.PM[currentYear];
        countryInfo["co"] = el.CM[currentYear];
      }
    });

    this.setState({ countryInfo });
  };

  render() {
    const {
      hovered,
      focused,
      clicked,
      PMColors,
      countryInfo,
      topC,
      currentYear
    } = this.state;

    const layerProps = {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onClick: this.onClick
    };
    return (
      <div className="map-container">
        {/* <StyledMap> */}
        <StyledMap>
          <VectorMap {...world} layerProps={layerProps} />
        </StyledMap>
        {/* </StyledMap> */}

        <div className="info">
          <h4 className="country-name">
            {countryInfo.name ? countryInfo.name : "Choose Country"}
          </h4>
          {countryInfo.name && (
            <ul className="list">
              <li className="list-el">
                <span className="pm-triger">
                  <InfoIcon />
                  <div className="info-data pm-data">
                    PM2.5 refers to atmospheric particulate matter (PM) that
                    have a diameter of less than 2.5 micrometers, which is about
                    3% the diameter of a human hair. Since they are so small and
                    light, fine particles tend to stay longer in the air than
                    heavier particles. This increases the chances of humans and
                    animals inhaling them into the bodies. Owing to their minute
                    size, particles smaller than 2.5 micrometers are able to
                    bypass the nose and throat and penetrate deep into the lungs
                    and some may even enter the circulatory system.
                  </div>
                </span>
                PM<sub>2.5</sub>: {countryInfo.pm.toFixed(2)}
              </li>
              <li className="list-el">
                <span className="co-triger">
                  <InfoIcon />
                  <div className="info-data co-data">
                    Carbon dioxide becomes a poisonous gas when there is too
                    much of it in the air you breathe. Besides the effects it
                    can have on the planet and the atmosphere, carbon dioxide
                    poisoning can lead to central nervous system damage and
                    respiratory deterioration in humans and other breathing
                    creatures. Carbon dioxide can affect your mental health and
                    sleep quality. Common side effects of increased carbon
                    dioxide levels include: • Drowsiness • Headaches • Decreased
                    Productivity • Difficulty with decision making
                  </div>
                </span>{" "}
                CO<sub>2</sub>:{countryInfo.co.toFixed(2)}
              </li>
            </ul>
          )}
          <hr />
          TimeBar
          <hr />
          <h4>
            Top 10 counries by CO<sub>2</sub> emissions
          </h4>
          <ul>
            {topC &&
              topC.map(el => (
                <li className="list-el">
                  {el.name} {el.co.toFixed(2)}
                </li>
              ))}
          </ul>
          <hr />
          <p className="text">
            Ischemic heart disease (IHD) is the main global cause of death,
            accounting for >9 million deaths in 2016 according to the World
            Health Organization (WHO) estimates
          </p>
        </div>
      </div>
    );
  }
}

export default MyMap;
