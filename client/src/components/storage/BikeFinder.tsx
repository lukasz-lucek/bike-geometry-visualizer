
import React, { useEffect, useState } from 'react';
import SelectSearch, { SelectSearchOption, SelectedOptionValue } from 'react-select-search';
import { getAxiosInstance } from '../../utils/AxiosUtils';
import FoundBikesList from './FoundBikesList';

const BikeFinder = () => {

  const [bikeMake, setBikeMake] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [bikeYear, setBikeYear] = useState<number | null>(null);

  const [bikeMakes, setBikeMakes] = useState<SelectSearchOption[]>([]);
  const [bikeModels, setBikeModels] = useState<SelectSearchOption[]>([]);
  const [bikeYears, setBikeYears] = useState<SelectSearchOption[]>([]);

  // const [bikeSearchPrase, setBikeSearchPhrase] = useState('');

  const filterMakes = (query: String) =>  {
    const axiosInstance = getAxiosInstance();
    axiosInstance.get('/api/makes', {
      params: {
        ...(query.length > 0 && {search: query})
      }
    }).then(resp => {
      const data = resp.data as [string];
      setBikeMakes(data.map((val) => ({name: val, value: val})));
    }).catch(err => {
      console.log(err);
    });
  }

  const filterModels = (query: String, make: string) =>  {
    const axiosInstance = getAxiosInstance();
    axiosInstance.get('/api/models', {
      params: {
        ...(query.length > 0 && {search: query}),
        ...(make.length > 0 && {make: make})
      }
    }).then(resp => {
      const data = resp.data as [string];
      setBikeModels(data.map((val) => ({name: val, value: val})));
    }).catch(err => {
      console.log(err);
    });
  }

  const filterYears = (make: string, model: string) =>  {
    const axiosInstance = getAxiosInstance();
    axiosInstance.get('/api/years', {
      params: {
        ...(model.length > 0 && {model: model}),
        ...(make.length > 0 && {make: make})
      }
    }).then(resp => {
      const data = resp.data as [number];
      setBikeYears(data.map((val) => ({name: val.toString(), value: val})));
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    filterMakes('');
  },
  []);

  useEffect(() => {
    filterModels('', bikeMake);
    modelChange('');
  },
  [bikeMake]);

  useEffect(() => {
    filterYears(bikeMake, bikeModel);
    yearChange(null);
  },
  [bikeMake, bikeModel]);

  const makeChange = (val: SelectedOptionValue) => {
    console.log("setting bile make to " + val);
    setBikeMake(val.toString());
  }

  const modelChange = (val: SelectedOptionValue) => {
    console.log("setting bile model to " + val);
    setBikeModel(val.toString());
  }

  const yearChange = (val: SelectedOptionValue | null) => {
    console.log("setting bile year to " + val);
    setBikeYear(val as number);
  }

  return (
    <div>
      <SelectSearch 
        options={bikeMakes}
        onChange={(val) => {makeChange(val as SelectedOptionValue)}}
        search={true}
        value={bikeMake}
        placeholder={'Make (type to find)'}
      />
      <SelectSearch 
        options={bikeModels}
        onChange={(val) => {modelChange(val as SelectedOptionValue)}}
        search={true}
        value={bikeModel}
        placeholder={'Model (type to find)'}
      />
      <SelectSearch 
        options={bikeYears}
        onChange={(val) => {yearChange(val as SelectedOptionValue)}}
        search={true}
        value={bikeYear?.toString()}
        placeholder={'Model Year (type to find)'}
      />
      <FoundBikesList bikeMake={bikeMake} bikeModel={bikeModel} bikeYear={bikeYear}/>
      
    </div>
  );
};

export default BikeFinder;
