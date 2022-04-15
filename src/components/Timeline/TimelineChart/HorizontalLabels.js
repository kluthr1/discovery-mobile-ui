import React from 'react';
import { number } from 'prop-types';
import { Line, Text as SvgText } from 'react-native-svg';

import * as config from './config';

const HorizontalLabels = ({
  availableWidth, countForMaxBarHeight, maxBarHeight,
}) => {
  if (!countForMaxBarHeight) {
    return null;
  }
  const verticalBoundLabel = `${countForMaxBarHeight}`;
  return (
    <>
      <Line
        x1={0}
        y1={-1}
        x2={availableWidth}
        y2={-1}
        stroke={config.BOUNDARY_LINE_COLOR}
        strokeDasharray="2 2"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <SvgText
        fill={config.LABEL_COLOR}
        stroke="none"
        fontSize={config.LABEL_FONT_SIZE}
        x={-4}
        y={1}
        textAnchor="end"
      >
        {Math.round(verticalBoundLabel/4) * 4}
      </SvgText>


      <Line
        x1={0}
        y1={maxBarHeight/4 - 1}
        x2={availableWidth}
        y2={maxBarHeight/4 - 1}
        stroke={config.BOUNDARY_LINE_COLOR}
        strokeDasharray="2 2"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />

      <SvgText
        fill={config.LABEL_COLOR}
        stroke="none"
        fontSize={config.LABEL_FONT_SIZE}
        x={-4}
        y={maxBarHeight/4 + 1}
        textAnchor="end"
      >
        {Math.round(verticalBoundLabel/4) * 3}
      </SvgText>


      <Line
        x1={0}
        y1={2*maxBarHeight/4 - 1}
        x2={availableWidth}
        y2={2*maxBarHeight/4 - 1}
        stroke={config.BOUNDARY_LINE_COLOR}
        strokeDasharray="2 2"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />

      <SvgText
        fill={config.LABEL_COLOR}
        stroke="none"
        fontSize={config.LABEL_FONT_SIZE}
        x={-4}
        y={2*maxBarHeight/4 + 1}
        textAnchor="end"
      >
        {Math.round(verticalBoundLabel/4) * 2}
      </SvgText>


      <Line
        x1={0}
        y1={3*maxBarHeight/4 - 1}
        x2={availableWidth}
        y2={3*maxBarHeight/4 - 1}
        stroke={config.BOUNDARY_LINE_COLOR}
        strokeDasharray="2 2"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <SvgText
        fill={config.LABEL_COLOR}
        stroke="none"
        fontSize={config.LABEL_FONT_SIZE}
        x={-4}
        y={3*maxBarHeight/4 + 1}
        textAnchor="end"
      >
        {Math.round(verticalBoundLabel/4) * 1}
      </SvgText>


    </>
  );
};

HorizontalLabels.propTypes = {
  availableWidth: number.isRequired,
  countForMaxBarHeight: number.isRequired,
  maxBarHeight: number.isRequired,
};




export default HorizontalLabels;
