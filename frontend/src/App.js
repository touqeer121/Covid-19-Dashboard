import React from 'react';
import axios from 'axios';

import { Cards, CountryPicker, Chart} from './components';
import { fetchData, fetchNewsData } from './api/';
import styles from './App.module.css';
import DatePicker from './components/DatePicker/DatePicker';
import LatestNews  from './components/LatestNews/LatestNews';

import image from './images/image.png';
const todays_date = new Date();
const month = (todays_date.getMonth()+1) <=9 ? ('0' + (todays_date.getMonth()+1)) : (todays_date.getMonth()+1);
const date_ = (todays_date.getDate()) <=9 ? ('0' + todays_date.getDate()) : (todays_date.getDate());
var today =  `${todays_date.getFullYear()}-${month}-${date_}`;

class App extends React.Component {
  state = {
    data: {},
    country: '',
    provinceState:'',
    chartType:'bar',
    fromDate:'2020-06-22',
    toDate: '2020-07-22',
    all_dates:[]
  }

  async componentDidMount() {
    this.setState({toDate: today},
                        {fromDate: today}
    )
    const data = await fetchData();
    
    //const date_data = await fetchDateData();
    this.setState({ data });
  }

  handleCountryChange = async (country) => {
    const data = await fetchData(country);
    if(country != '')

      this.setState({chartType: 'bar'});
    this.setState({ data, country: country });
  }

  handleChartChange = (chartType) =>{
    this.setState({chartType: chartType});
   
  }

  handleStateChange = (stateData, provinceState) => {
    this.setState({provinceState: provinceState});
    const new_data = ("wassup", stateData.filter((state)=>{
      return state.provinceState === provinceState
    }));

    this.setState({data:{confirmed:{value: new_data[0]['confirmed']} ,recovered:{value: new_data[0]['recovered']} ,deaths:{value:new_data[0]['deaths']}}})

  }

  
  handleFromDateChange = (date) =>{
    this.setState({fromDate: date})
  }

  handleToDateChange = (date) =>{
    this.setState({toDate: date});
  }

   getDate=()=>{ 
    var dArray = []; 
    const strDate = this.state.fromDate;
    const stpDate = this.state.toDate;

    let cDate = strDate;
    while (cDate <= stpDate) { 
          
        // Adding the date to array 
        dArray.push(new Date (cDate));  
          
        // Increment the date by 1 day 
        cDate = cDate.addDay(1);
    } 
    this.setState({all_dates: dArray}) 
} 

  render() {
    const { data, country, chartType, provinceState, fromDate, toDate } = this.state;

    return (
      <div className={styles.container}>
        <img className={styles.image} src={image} alt="COVID-19" />
        <Cards data={data} />
        <CountryPicker handleCountryChange={this.handleCountryChange} handleChartChange={this.handleChartChange} 
          handleStateChange={this.handleStateChange} chartType={chartType} country={country} />
                {chartType == 'line' ? (
                <div style={{display:"flex"}}>
                  <DatePicker   defaultDate={this.state.fromDate} label = "From" changeDate={this.handleFromDateChange}/> 
                  <DatePicker   defaultDate={this.state.toDate} label = "To" changeDate={this.handleToDateChange}/> 
                {/*<button onClick={this.getDate}>Go</button>*/}
                </div>): null}
        <Chart data={data} country={country} chartType={chartType}
                     provinceState={provinceState} fromDate={fromDate} toDate={toDate}/> 
                     <LatestNews />
      </div>
    );
  }
}

export default App;