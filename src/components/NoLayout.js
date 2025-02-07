import React from 'react';

const NoLayout = ({ children }) => {
  return <>{children}</>;  // Aquí no renderizamos el Header ni el Footer
};

export default NoLayout;