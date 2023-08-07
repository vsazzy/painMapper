import React from 'react';

const ResultsContext = React.createContext({
  painData: [],
  jointData: [],
  setJointData: () => {},
  addPainData: () => {},
});

export default ResultsContext;
