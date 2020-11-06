import React from 'react';
import CustomHeader from './CustomHeader';

export default WrappedComponent => {
  const hocComponent = ({...props}) => (
    <>
      <CustomHeader />
      <WrappedComponent {...props} />
    </>
  );

  return hocComponent;
};
