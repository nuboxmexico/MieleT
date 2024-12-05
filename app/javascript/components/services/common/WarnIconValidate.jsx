import React from "react"
import ErrorIcon from '@material-ui/icons/Error';

const WarnIconValidate = ({ oldValue, newValue }) => {
  return (
    Number(newValue) !== Number(oldValue)
    && <ErrorIcon fontSize='small' style={{ color: '#f2c46e', marginRight: '4px' }} />
  )
}

export default WarnIconValidate
