import { useState } from "react";

// copy pasta from here: https://stackoverflow.com/questions/46240647/react-how-to-force-a-function-component-to-render/53837442#53837442
//create your forceUpdate hook
export function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here
  // is better than directly setting `value + 1`
}
