import axios from 'axios';
import convert from 'xml-js';
import global_data from './../db_country_wise.json';
import global_series_data from './../db_global.json';
var XMLParser = require('react-xml-parser');

const url = 'https://covid19.mathdro.id/api';

export const fetchData = async (country) => {
  let changeableUrl = url;
 
  if (country) {
    changeableUrl = `${url}/countries/${country}`;
  }

  try {
    const { data: { confirmed, recovered, deaths, lastUpdate } } = await axios.get(changeableUrl);

    return { confirmed, recovered, deaths, lastUpdate };
  } catch (error) {
    return error;
  }
};

export const fetchNewsData = async () =>{
  let news_data = [];
  let res_data = []
  try {
     news_data = await axios.get("https://www.who.int/rss-feeds/news-english.xml");
     console.log("working here");
    // console.log(news_data);
    news_data = new XMLParser().parseFromString(news_data.data);
    news_data =  news_data['children'][0]['children'];
     news_data.forEach(item => {
      if (item.name == 'item')
      {
        let tmp_obj = {};
        item.children.forEach((ele) => {
          
          tmp_obj[ele['name']] = ele['value'];
            
        });
        if(tmp_obj['title'].includes('Corona') || tmp_obj['title'].includes('corona') || tmp_obj['title'].includes('COVID'))
            res_data.push(tmp_obj);
        // console.log(tmp_obj);
      }
     });

   /* news_data = news_data.map((item)=>{
          
    })*/
    // console.log("getched news 2", json_data);

  }
  catch (error){
    return error;
  }
  return res_data;
}

export const fetchDailyData = async (country, fromDate, toDate) => {
  try {
    let d1 = new Date (fromDate);
    let d3 = new Date(toDate);
    
    if(!country)
    {
      var data  = global_series_data.filter((item)=>{

        let d2 = new Date(item.date);
         
         return ( d2.getTime() <= d3.getTime()  && d1.getTime() <= d2.getTime());
      });
    }
    else{
      var data  = global_data[country].filter((item)=>{
        let d2 = new Date(item.date);
        return ( d2.getTime() <= d3.getTime()  && d1.getTime() <= d2.getTime());
      });
      return data;
    }
    return data
  } catch (error) {
    return error;
  }
};

export const fetchCountries = async () => {
  let all_countries =  Object.keys(global_data);
  console.log("hello countries");
  try {
    const { data: { countries } } = await axios.get(`${url}/countries`);
    console.log(countries.map((country) => country.name))
    return all_countries;
  } catch (error) {
    return error;
  }
};


export const fetchStatesData = async (country) => {
  let changeableUrl = url;

  console.log("Hey country", country);
  if (country) {
    changeableUrl = `${url}/countries/${country}/confirmed`;
  }

  try {
    const data= await axios.get(changeableUrl);
    console.log("helloo data", data);
    return data.data;
    //return { confirmed, recovered, deaths, lastUpdate };
  } catch (error) {
    return error;
  }
};

export const fetchDataBetweenDates = () =>{

}