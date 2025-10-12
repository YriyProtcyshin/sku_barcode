import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const Barcode = ({ value }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (value) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 80,
        displayValue: true,
      });
    }
  }, [value]);

  return <svg ref={svgRef}></svg>;
};

export default Barcode;
