import React, { useState } from 'react';

interface Props {
    children: React.ReactNode;
    text: string;
    direction?: 'top' | 'bottom';
}

const Tooltip = ({ children, text, direction = 'top' }: Props) => {
    const [hovering, setHovering] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {hovering && (
                <div
                    className={`
            ${direction === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
            left-1/2 transform -translate-x-1/2 absolute border_muted border-1 p-2 px-4 rounded text-sm
          `}
                >
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;