import React, {useState, useEffect} from "react"
import axios from 'axios';
import {useParams} from "react-router-dom";

import {Paper, Accordion, AccordionDetails, AccordionSummary, Grid} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ProjectUnitRealStates from "components/projectCustomers/ProjectUnitRealStates";
import { useTranslation } from 'react-i18next';

function ProjectDetail(props) {
  const {t} = useTranslation();
  const {setLoading} = props

  const [project, setProject] = useState({})
  const {id: customer_id, project_id: projectId} = useParams()

  async function fetchProject() {
    const response = await axios.get(`/api/v1/projects/${projectId}`)
    setProject(response.data)
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    fetchProject()
  }, [])


  function Item({title, value}) {
    return (
      <>
        <p className="light-label">
          {title}
        </p>
        <p className="normal-label">
          {value || "-"}
        </p>

      </>
    )

  }

  const headerItems = [
    {title: t('globalTables.serviceColumns.customerFullName'), value: `${project.contact_name} ${project.contact_lastname}`},
    {title: t('globalTables.serviceColumns.status'), value: project.status},
  ]

  const bigItems = [
    {title: t('globalTables.customerColumns.phone'), value: project.contact_cellphone},
    {title: t('globalTables.customerColumns.businessName'), value: project.builder_name},
    {title: t('globalTables.customerColumns.rfc'), value: project.builder_rut},
    {title: t('globalTables.customerColumns.address'), value: project.address_label},
    {title: t('globalTables.projectColumns.commune'), value: project.commune},
  ]

  return (
    <>
      <Paper className="custom-paper">
        <Grid container style={{marginBottom: "20px"}}>
          <Grid item sm={12} >
            <h1>
              <span>{project.name}</span>
            </h1>
            <p>{project.code}</p>
          </Grid>
        </Grid>
        <Grid container>

          {
            headerItems.map(({title, value}, i) => (
              <Grid key={i} item sm={2}>
                <Item title={title} value={value} />
              </Grid>
            ))
          }
        </Grid>
      </Paper>
      <br />


      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h1 className="panel-custom-title">{t('customer.quoteData')}</h1>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid container style={{marginBottom: "13px"}}>
              {
                bigItems.map(({title, value}, i) => (
                  <Grid key={`${title}-${i}`} item sm={2} style={{marginBottom: "10px"}}>
                    <Item title={title} value={value} />
                  </Grid>
                ))
              }
            </Grid>

          </Grid>

        </AccordionDetails>
      </Accordion>
      <br />
      <Paper className="custom-paper">
        {
          project.id && <ProjectUnitRealStates unitRealStates={project.unit_real_states}/>
        }
      </Paper>
    </>
  )
}

export default ProjectDetail
