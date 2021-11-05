import { useParams } from 'umi';
import React from 'react';

const PaperIndex = (props) => {
  const id = (useParams() as any).id;
  return <div>{id}</div>;
};

export default PaperIndex;
