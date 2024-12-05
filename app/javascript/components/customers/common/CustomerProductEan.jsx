import React from "react"
import {Tooltip, Typography} from "@material-ui/core"
import {isB2bEan} from "../utils"

function CustomerProductEan({serial_id, b2b_ean}) {
  return (
    <>
      {
        isB2bEan(serial_id, b2b_ean) ?
          <span>
            <Tooltip title="B-STOCK">
              <Typography color="primary" component="span" style={{textDecoration: "underline"}}>
                {(!serial_id ? "-" : serial_id)}
              </Typography>
            </Tooltip>
          </span>

          :
          <span>
            {(!serial_id ? "-" : serial_id)}
          </span>
      }
    </>
  )
}

export default CustomerProductEan
