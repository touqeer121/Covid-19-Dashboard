import React, { useState, useEffect } from 'react';
import { NativeSelect, FormControl, RadioGroup ,  FormControlLabel , Radio} from '@material-ui/core';

import { fetchCountries } from '../../api';
import  StatePicker  from '../StatePicker/StatePicker'

import styles from './CountryPicker.module.css';

const Countries = ({ handleCountryChange, handleChartChange, handleStateChange, chartType, country}) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      setCountries(await fetchCountries());
    };

    fetchAPI();
  }, []);



  return (
    <FormControl className={styles.formControl}>
      <NativeSelect defaultValue="" onChange={(e) => handleCountryChange(e.target.value)}>
        <option value="">Global</option>
        {countries.map((country, i) => <option key={i} value={country}>{country}</option>)}
      </NativeSelect>
      <RadioGroup aria-label="charttype" name="charttype" value={chartType} style={{display: "inline"}} onChange={(e)=>handleChartChange(e.target.value)}>
            <FormControlLabel value="bar" control={<Radio />} label="Bar Chart" />
            <FormControlLabel value="line" control={<Radio />} label="Line Chart" />
          </RadioGroup>
    {country == '' ? (
          null  
    ): <StatePicker country={country} handleStateChange={handleStateChange}/>}

    </FormControl>
  );
};

export default Countries;
