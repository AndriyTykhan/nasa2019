import styled from 'styled-components';
import { rgba } from 'polished';

const BORDER_STYLE = `0.2rem solid ${rgba('#000', 0.15)}`;
const STROKE_COLOR = '#fff';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: nowrap row;

  @media (max-width: 600px) {
    flex-flow: nowrap column;
  }
`;

export const Output = styled.div`
  padding-right: 1rem;
  flex: 1 1 0;
  border-right: ${BORDER_STYLE};

  @media (max-width: 600px) {
    padding-right: 0;
    padding-bottom: 1rem;
    border-right: none;
    border-bottom: 0.2rem solid ${BORDER_STYLE};
  }
`;

export const MapWrapper = styled.div`
  padding-left: 1rem;
  flex: 1 1 auto;

  @media (max-width: 600px) {
    padding-left: 0;
    padding-top: 1rem;
  }

  svg {
    stroke: ${STROKE_COLOR};
    stroke-width: 1;
    stroke-linecap: round;
    stroke-linejoin: round;

    path {
      :focus {
        outline: 0;
      }
    }
  }
`;

export const StyledMap = styled(MapWrapper)`
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