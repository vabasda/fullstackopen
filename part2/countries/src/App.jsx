import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => console.log('Error fetching data', error))
  }, [])

  const handleChange = (event) => {
    setSearch(event.target.value)
  }

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const showResults = () =>{
    if (search === ""){
      return null
    }

    if (countriesToShow.length> 10){
      return <p>Too many matches, specify another filter</p>
    }

    if (countriesToShow.length === 1){
      const country = countriesToShow[0]
      
      const languages = []
      for (const key in country.languages) {
        languages.push(country.languages[key])
      }
      
      return (
        <div>
          <h2>{country.name.common}</h2>
          <p>capital {country.capital}</p>
          <p>area {country.area}</p>
          
          <h3>languages:</h3>
          <ul>
            {languages.map(lang => (
              <li 
              key={lang}>{lang}
              </li>
            ))}
          </ul>
          
          <img 
            src={country.flags.svg} 
            alt="Flag" 
            style={{ width: '200px' }} 
          />
        </div>
      )
    }

    return (
      <div>
        {countriesToShow.map(country => (
          <p key={country.name.common}>{country.name.common}</p>
        ))}
      </div>
    )
  }

  return (
    <div>
      find countries <input value={search} onChange={handleChange} />
      <div>
        {showResults()}
      </div>
    </div>
  )
}

export default App