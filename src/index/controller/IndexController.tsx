import React, { useState } from 'react';
import Footer from '@/src/common/Footer/Footer';
import Navbar from '@/src/common/Navbar/Navbar';
import ScrollButtons from '@/src/common/ScrollButtons/ScrollButtons';
import CookieBanner from '../../../src/common/CookieConsent/CookieBanner';
const IndexController = (props?: any) => {
    const {
        children,
        ...rest
    } = props;

    const [loading, setLoading] = useState<boolean>(false);

    const viewProps = {
        loading,
        setLoading,
    };

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { ...rest, ...viewProps });
        }

        return child;
    });

    return (
        <div>
            <Navbar />
            <CookieBanner/>
            <ScrollButtons />
            {childrenWithProps}
            <Footer />
        </div>
    );
};

export { IndexController };
