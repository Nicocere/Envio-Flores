import React, { useEffect } from 'react';
import Confetti from 'react-confetti';

const ConfettiComponent = () => {
    const [dimensions, setDimensions] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Confetti
            width={dimensions.width}
            height={dimensions.height}
            numberOfPieces={850}
            recycle={false}
        />
    );
};

export default ConfettiComponent;