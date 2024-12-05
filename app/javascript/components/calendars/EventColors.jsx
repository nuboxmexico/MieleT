import React, {useState, useEffect} from "react"
import {Box} from "@material-ui/core"
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import Skeleton from '@material-ui/lab/Skeleton';
import {headers} from "constants/csrf"
import axios from 'axios'
import { useTranslation } from 'react-i18next';

export default function EventColors() {
  const {t} = useTranslation();
  const [colors, setColors] = useState([])
  const [load, setLoad] = useState(false)
  const styles = {
    description: {
      fontSize: '14px',
      fontWeigt: '300',
      textAlign: 'left'
    }
  };
  async function getEventColors() {
    const {data} = await axios.get('api/v1/calendar_events/colors', {headers: headers})
    setColors(data)
    setLoad(true)
  }

  useEffect(() => {
    function fetchData() {
      getEventColors()
    }
    fetchData()
  }, [])

  return (
    <React.Fragment>
    { (!load) &&
    <Skeleton height={21} />
    ||
      Object.keys(colors).map((key, index) =>
        <Box key={index} mr={3} component="span">
          <StopRoundedIcon fontSize="large" style={{color: colors[key], fontSize: '28px'}} />
          <span styles={styles.description}>
            {t(`calendar.${key}`)}
          </span>
        </Box>
      )
    }    
    </React.Fragment>
  )
}
