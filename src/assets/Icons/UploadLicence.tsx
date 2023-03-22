import * as React from "react";
import Svg, { Path } from "react-native-svg";

const UploadLicence = (props) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M2 8a3 3 0 0 1 3-3h1.667a4 4 0 0 1 2.4.8l1.866 1.4a4 4 0 0 0 2.4.8H19a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8Z"
      stroke="#3B4657"
      strokeWidth={1.5}
    />
    <Path
      d="M6 5h8.421a4 4 0 0 1 2.89 1.235L19 8"
      stroke="#3B4657"
      strokeWidth={1.5}
    />
    <Path
      d="m14.828 14.828-2.474-2.474a.5.5 0 0 0-.708 0l-2.474 2.474M12 13v5"
      stroke="#3B4657"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);

export default UploadLicence;
