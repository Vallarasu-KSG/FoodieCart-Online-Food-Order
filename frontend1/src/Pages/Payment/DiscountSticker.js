// DiscountSticker.js
import React from 'react';

const DiscountSticker = ({ code, discount }) => {
  return (
    <div className="discount-sticker">
      <p>Use code <strong>{code}</strong> to get <strong>{discount}% off!</strong></p>
    </div>
  );
};

export default DiscountSticker;
