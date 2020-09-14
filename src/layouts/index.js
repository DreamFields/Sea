import BasicLayouts from './BasicLayouts.js';
import UserLayout from './UserLayouts.js';
import React from 'react';

const index = (props) => {
  const {
    location
  } = props;
  const {pathname} = location;
  console.log(pathname)
  if (pathname.search('/user') == -1) {
    return(
      <BasicLayouts {...props}/>
    )
  }else if(pathname.search('/user') != -1){
    return(
      <UserLayout {...props} />
    )
  }
}

export default index;