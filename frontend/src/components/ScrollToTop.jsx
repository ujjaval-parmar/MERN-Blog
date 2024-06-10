import React, { useEffect } from 'react'
import {  useLocation } from 'react-router-dom';

const ScrollToTop = () => {

    const { pathname } = useLocation();

    
    
    useEffect(() => {
        
        // Scroll top when location changes
        window.scrollTo(0, 0);


    }, [pathname]);

    return null;
    
}



export default ScrollToTop