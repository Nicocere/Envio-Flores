import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const ConfettiComponent = () => {

    const { width, height } = useWindowSize()

    return (
        <Confetti
        width={width}
        height={height}
            numberOfPieces={850}
            recycle={false}
        />
    );
};

export default ConfettiComponent;