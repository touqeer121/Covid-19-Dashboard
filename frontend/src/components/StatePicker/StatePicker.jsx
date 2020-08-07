import React, { useState, useEffect } from 'react';
import { NativeSelect, FormControl, RadioGroup ,  FormControlLabel , Radio} from '@material-ui/core';

import { fetchStatesData } from '../../api';

import styles from '../CountryPicker/CountryPicker.module.css';

const States = ({country, handleStateChange}) => {
    const [provincestates, setStates] = useState([]);

    useEffect(() => {
      const fetchAPI = async () => {
        setStates(await fetchStatesData(country));
      };
  
      fetchAPI();
      console.log("provincestates", provincestates)
    }, [country]);


    return (
        <FormControl className={styles.formControl}>
        <NativeSelect defaultValue="" onChange={(e) => handleStateChange(provincestates, e.target.value)}>
        <option value="">Global</option>
        {provincestates.length ? (provincestates.map((state, i) => <option key={state.uid} value={state.provinceState}>{state.provinceState}</option>)) : null}
      </NativeSelect>
      </FormControl>
    )
}

export default States;