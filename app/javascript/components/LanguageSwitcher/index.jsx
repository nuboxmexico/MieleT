import React, { useEffect } from 'react'
import LanguageIcon from '@material-ui/icons/Language'
import { MenuItem, Select, InputAdornment, FormControl, styled } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

function LanguageSwitcher () {
  const { i18n } = useTranslation()
  const subdomainRegex = /^\w{2}\./

  const CustomSelect = styled(Select)({
    '& .MuiSelect-select:focus': {
      backgroundColor: 'transparent'
    }
  })

  const selectLabel = {
    es: 'ES',
    pt: 'PT'
  }

  const subdomainPerLanguage = {
    es: '',
    pt: 'br.'
  }

  function handleChange (e) {
    const lang = e.target.value
    i18n.changeLanguage(lang)

    let redirectUri = window.location.host.replace(subdomainRegex, '')
    redirectUri = subdomainPerLanguage[lang] + redirectUri
    console.log({ redirectUri, host: window.location.host })
    if (window.location.host !== redirectUri) {
      window.location.host = redirectUri
    }
  }

  // Set the language by the subdomain
  useEffect(() => {
    // Get the subdomain from the url
    // If there is no subdomain, set the language to spanish
    // example: "br."
    const subdomain = window.location.host.match(subdomainRegex)?.toString()

    if (!subdomain) return i18n.changeLanguage('es')

    const newLanguage = Object.keys(subdomainPerLanguage).filter(key => subdomainPerLanguage[key] === subdomain)

    i18n.changeLanguage(newLanguage)
  }, [])

  return (
    <FormControl>
      <CustomSelect
        disableUnderline
        startAdornment={
          <InputAdornment style={{ marginRight: '3px', marginBottom: '3px' }} position='end'>
            <LanguageIcon />
          </InputAdornment>
        }
        variant='standard'
        color='secondary'
        value={i18n.language}
        defaultValue='es'
        onChange={handleChange}
        renderValue={value => selectLabel[value]}
      >
        <MenuItem value='es'>Español</MenuItem>
        <MenuItem value='pt'>Portugués</MenuItem>
      </CustomSelect>
    </FormControl>
  )
}

export default LanguageSwitcher
