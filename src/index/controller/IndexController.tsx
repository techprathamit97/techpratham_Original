import React, { useState } from 'react';
import Footer from '@/src/common/Footer/Footer';

// Navbar2 is the new home-page navbar (transparent hero → solid on scroll).
// All other pages use the original Navbar.
import Navbar from '@/src/common/Navbar/Navbar';
import Navbar2 from '@/src/common/Navbar/Navbar2';

import ScrollButtons from '@/src/common/ScrollButtons/ScrollButtons';
import CookieBanner from '../../../src/common/CookieConsent/CookieBanner';
import { NavbarData } from '@/utils/navbarData';

interface IndexControllerProps {
  children?: React.ReactNode;
  navbarData?: NavbarData;
  /** Set to true only on the home page to render Navbar2 */
  useNavbar2?: boolean;
  [key: string]: any;
}

const IndexController: React.FC<IndexControllerProps> = (props) => {
    const {
        children,
        navbarData,
        useNavbar2 = false,
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
            {useNavbar2
              ? <Navbar2 navbarData={navbarData} />
              : <Navbar navbarData={navbarData} />
            }
            <CookieBanner/>
            <ScrollButtons />
            {childrenWithProps}
            <Footer />
        </div>
    );
};

export { IndexController };
