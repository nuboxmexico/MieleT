import React from "react"
import Tooltip from '@material-ui/core/Tooltip';

function EventTooltip({ arg, tecnicos }) {

  const principal_technician_id = arg.event.extendedProps.principal_technician_id
  let technician_ids = arg.event.extendedProps.technician_ids
  technician_ids = technician_ids?.filter(technician_id => technician_id !== principal_technician_id)?.map(Number) || []
  const technicians = tecnicos.filter(tecnico => technician_ids.includes(tecnico.id)).map(tecnico => {
    return `<span>${tecnico.user.fullname}</span>`
  })

  const principal_technician = tecnicos.find(tecnico => tecnico.id == Number(principal_technician_id))
  let description = arg.event.extendedProps.description
  const principal_technician_name = principal_technician?.user?.fullname
  description += `<b>Técnico Principal: </b> <span>${principal_technician_name ? principal_technician_name + ', ' : '-'} ${principal_technician?.enterprise || ''}</span><br>`
  description += `<b>Técnico(s) Adicional(es): </b> <span>${technicians ? technicians.join(', ') : '-'}</span>`

  return (
    <Tooltip title={
      <React.Fragment>
        <div className="service-tooltip" dangerouslySetInnerHTML={{__html: (description || "")}} />
      </React.Fragment>

    } arrow>
        <span className="fc-daygrid-dot-event">
        <div className="fc-daygrid-event-dot" style={{"borderColor": arg.backgroundColor}}></div>
        <div className="fc-event-time">{arg.timeText}</div>
        <div className="fc-event-title">{arg.event.title || ""}</div>
      </span>
    </Tooltip>
  )
}

export default EventTooltip
