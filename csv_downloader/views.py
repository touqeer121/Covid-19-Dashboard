from django.shortcuts import render
from django.http import HttpResponse,HttpRequest
import os
from collections import defaultdict
from urllib.request import urlretrieve as retrieve
import csv, json
import pandas as pd
from datetime import datetime, timedelta

def index(request):
    response = {}
    return render(request, 'csv_downloader/index.html', response)

def get_previous_date(date):
    converted_date = datetime.strptime(date, "%m/%d/%y")
    prev_date = converted_date - timedelta(days=1)
    dd = prev_date.strftime("%d")
    mm = prev_date.strftime("%m")
    yyyy = prev_date.strftime("%y")
    output = dd + '/' + mm + '/' + yyyy
    return output

def download_csv(request):
    confirmed_url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_' \
                 'series/time_series_covid19_confirmed_global.csv'
    deaths_url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_'\
              'series/time_series_covid19_deaths_global.csv'
    recovered_url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_' \
                 'series/time_series_covid19_recovered_global.csv'
    confirmed_filename = 'confirmed_csv_data.csv'
    deaths_filename = 'deaths_csv_data.csv'
    recovered_filename = 'recovered_csv_data.csv'

    myPath = './Data/CSV'
    confirmed_fullpath = os.path.join(myPath, confirmed_filename)
    deaths_fullpath = os.path.join(myPath, deaths_filename)
    recovered_fullpath = os.path.join(myPath, recovered_filename)

    retrieve(confirmed_url, confirmed_fullpath)
    retrieve(deaths_url, deaths_fullpath)
    retrieve(recovered_url, recovered_fullpath)

    confirmed_data = pd.read_csv(confirmed_fullpath)
    confirmed_data = confirmed_data.drop(['Lat', 'Long'], axis=1)

    # confirmed_data = confirmed_data.groupby(['Country/Region'])

    # data = defaultdict(list)
    data = defaultdict(dict)

    for i in range(len(confirmed_data)):
        for j in range(2, len(confirmed_data.columns)):
            if confirmed_data.iloc[i][1] in data:
                if confirmed_data.columns[j] in data[confirmed_data.iloc[i][1]]:
                    data[confirmed_data.iloc[i][1]][confirmed_data.columns[j]]['Confirmed'] = \
                        confirmed_data.iloc[i][j] + \
                        data[confirmed_data.iloc[i][1]][confirmed_data.columns[j]]['Confirmed']
                else:
                    thisDict = {
                        'Confirmed': confirmed_data.iloc[i][j],
                        'Deaths': 0,
                        'Recovered': 0
                    }
                    data[confirmed_data.iloc[i][1]][confirmed_data.columns[j]] = thisDict
            else:
                thisDict = {
                    'Confirmed': confirmed_data.iloc[i][j],
                    'Deaths': 0,
                    'Recovered': 0
                }
                data[confirmed_data.iloc[i][1]][confirmed_data.columns[j]] = thisDict

    recovered_data = pd.read_csv(recovered_fullpath)
    recovered_data = recovered_data.drop(['Lat', 'Long'], axis=1)
    for i in range(len(recovered_data)):
        for j in range(2, len(recovered_data.columns)):
            if recovered_data.iloc[i][1] in data:
                if recovered_data.columns[j] in data[recovered_data.iloc[i][1]]:
                    data[recovered_data.iloc[i][1]][recovered_data.columns[j]]['Recovered'] = \
                        recovered_data.iloc[i][j] + \
                        data[recovered_data.iloc[i][1]][recovered_data.columns[j]]['Recovered']
                else:
                    thisDict = {
                        'Confirmed': 0,
                        'Deaths': 0,
                        'Recovered': recovered_data.iloc[i][j],
                    }
                    data[confirmed_data.iloc[i][1]][recovered_data.columns[j]] = thisDict
            else:
                thisDict = {
                    'Confirmed': 0,
                    'Deaths': 0,
                    'Recovered': recovered_data.iloc[i][j],
                }
                data[recovered_data.iloc[i][1]][recovered_data.columns[j]] = thisDict

    deaths_data = pd.read_csv(deaths_fullpath)
    deaths_data = deaths_data.drop(['Lat', 'Long'], axis=1)
    for i in range(len(deaths_data)):
        for j in range(2, len(deaths_data.columns)):
            if deaths_data.iloc[i][1] in data:
                if deaths_data.columns[j] in data[deaths_data.iloc[i][1]]:
                    data[deaths_data.iloc[i][1]][deaths_data.columns[j]]['Deaths'] = \
                        deaths_data.iloc[i][j] + \
                        data[deaths_data.iloc[i][1]][deaths_data.columns[j]]['Deaths']
                else:
                    thisDict = {
                        'Confirmed': 0,
                        'Deaths': deaths_data.iloc[i][j],
                        'Recovered': 0
                    }
                    data[confirmed_data.iloc[i][1]][deaths_data.columns[j]] = thisDict
            else:
                thisDict = {
                    'Confirmed': 0,
                    'Deaths': deaths_data.iloc[i][j],
                    'Recovered': 0
                }
                data[deaths_data.iloc[i][1]][deaths_data.columns[j]] = thisDict

    final_countrywise_data = defaultdict(list)

    for country, info in data.items():
        for i, j in info.items():
            # print(i)
            thisDict = {
                'confirmed': int(j['Confirmed']),
                'recovered': int(j['Recovered']),
                'deaths': int(j['Deaths']),
                'date': i,
            }
            final_countrywise_data[country].append(thisDict)

    tmp_global_data = defaultdict(dict)
    for country, info in data.items():
        for date, j in info.items():
            if date in tmp_global_data:
                tmp_global_data[date]['Confirmed'] = tmp_global_data[date]['Confirmed']+\
                                                     j['Confirmed']
                tmp_global_data[date]['Deaths'] = tmp_global_data[date]['Deaths']+\
                                                  j['Deaths']
                tmp_global_data[date]['Recovered'] = tmp_global_data[date]['Recovered']+\
                                                     j['Recovered']
            else:
                thisDict = {
                    'Confirmed': j['Confirmed'],
                    'Deaths': j['Deaths'],
                    'Recovered': j['Recovered'],
                }
                tmp_global_data[date] = thisDict

    final_global_data = []
    lastDayConfirmed = 0
    lastDayDeaths = 0
    lastDayRecovered = 0

    for date, j in tmp_global_data.items():
            # prev_date = get_previous_date(date)
            # print("Date : ", prev_date)
            thisDict = {
                'confirmed': int(j['Confirmed'] - lastDayConfirmed),
                'deaths': int(j['Deaths'] - lastDayDeaths),
                'recovered': int(j['Recovered'] - lastDayRecovered),
                'date': date
            }
            lastDayConfirmed = int(j['Confirmed'])
            lastDayDeaths = int(j['Deaths'])
            lastDayRecovered = int(j['Recovered'])
            final_global_data.append(thisDict)

    convert_csv_to_json(request, final_countrywise_data, "db_country_wise")
    convert_csv_to_json(request, final_global_data, "db_global")
    response = {}
    return render(request, 'csv_downloader/end.html', response)

def convert_csv_to_json(request,data, file_name):

    jsonFilePath = './frontend/src/'
    extension = '.json'
    jsonFilePath += file_name + extension

    with open(jsonFilePath, "w") as json_file:
        json.dump(data, json_file)
    print(file_name, " completed\n")
