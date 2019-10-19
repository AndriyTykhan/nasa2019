import React from 'react';
import VectorMap from '@south-paw/react-vector-maps';
import styled from '@emotion/styled';
import world from '@south-paw/react-vector-maps/maps/json/world.json';

import { MapWrapper } from './svgMap/styled.js';

const StyledMap = styled(MapWrapper)`
  padding: 1rem;
  background-color: #132238;

  // The root svg element of the vector map.
  svg {
    stroke: #132238;

    // All layers are just path elements.
    path {
      fill: #364e68;
      cursor: pointer;

      // When a layer is hovered.
      &:hover {
        fill: #98ccd3;
      }

      // When a layer is focused.
      &:focus {
        fill: #ebf0f6;
      }

      // When a layer is 'checked' (via 'aria-checked').
      &[aria-checked='true'] {
        fill: #8f1537;
      }

      // When a layer is 'selected' (via 'aria-current').
      &[aria-current='true'] {
        fill: #a275e3;
      }
    }
  }
`;


class MyMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: null,
      focused: null,
      clicked: null,
    };
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
    const { hovered, focused, clicked } = this.state;

    const layerProps = {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onClick: this.onClick,
    };
    return (
      <div className="map-container">
        <div>
        <p>
            <strong>Hovered layer:</strong> {hovered}
          </p>
          <p>
            <strong>Focused layer:</strong> {focused}
          </p>
          <p>
            <strong>Clicked layer:</strong> {clicked}
          </p>
        </div>
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