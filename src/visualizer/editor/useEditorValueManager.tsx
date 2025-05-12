import { useState } from 'react';
import stripJsonComments from 'strip-json-comments';
import jsonObjectStore, { setObject } from '../../store/reduxJsonObjectStore';

export function useEditorValueManager() {
  const [value, setValue] = useState(JSON.stringify(undefined, null, 2));
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [alertText, setAlertText] = useState("");

  const updateValue = (newValue: string) => {
    setValue(newValue);
  };

  const validateAndUpdateReduxState = () => {
    try {
      const parsed = JSON.parse(stripJsonComments(value));
      jsonObjectStore.dispatch(setObject(parsed));
      return true;
    } catch (e) {
      setAlertText("Text is not JSON format");
      setAlertDismissed(true);
      console.error(e);
      return false;
    }
  };

  return {
    value,
    updateValue,
    validateAndUpdateReduxState,
    alertDismissed,
    setAlertDismissed,
    alertText
  };
}