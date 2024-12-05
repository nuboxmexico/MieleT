import axios from 'axios'
import React, { useState, useEffect } from 'react';

function useCountries() {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState([])
  const [isos, setIsos] = useState([])


  useEffect(() => {
    async function getAllCountries() {
      try {
        const { data } = await axios.get('/api/v1/countries')
        setData(data)
        setIsos(data.map(country => country.iso))
        setLoading(false)
      } catch (e) {
        setError(e)
      }
    }

    getAllCountries()
  }, [])

  return {
    data,
    loading,
    error,
    isos
  }
}

export default useCountries
