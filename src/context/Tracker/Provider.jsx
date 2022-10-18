// import { useState, useEffect } from 'react';
import { TrackerContext } from './Context';

/**
 * @param {{children:React.ReactNode}} props
 */
const Provider = ({ children }) => {
    return <TrackerContext.Provider>{children}</TrackerContext.Provider>;
};

export default Provider;
