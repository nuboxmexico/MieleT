import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { flash_alert } from 'components/App';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import {csrf, headers, money_format} from "constants/csrf"

function PoliciesList(props){
 	return (
		<React.Fragment>
            <h1 className="panel-custom-title">Selección de pólizas</h1>
                        
            {props.policies.length > 0 && 
            
                <List>
                    
                    {
                    props.policies.map((policy) => {
                        const labelId = `radio-policies-list-label-${policy.id}`;
                        return (
                        <ListItem key={labelId} role={undefined} dense button onClick={() => props.handlePolicyRowChange(policy)}>
                            <ListItemIcon className="service-address-label">
                            <FormControlLabel value={policy.id} control={<Radio color="primary"/>} label="" checked={props.selectedPolicies == policy.id}
                                tabIndex={-1}
                            />
                            
                            </ListItemIcon>
                            
                            <ListItemText 
                                id={labelId}
                                primary={''}
                                secondary={
                                    <div className="policy-summary" >
                                        <span className="policy-col"><span className="policy-summary-1">Póliza</span><br/><span className="policy-summary-2">N° {policy.customer_id}-{policy.id}</span></span>
                                        <span className="policy-col"><span className="policy-summary-1">Valor</span><br/><span className="policy-summary-2">{money_format(props.country,policy.total_price)}</span></span>
                                        <span className="policy-col"><span className="policy-summary-1">Pagado</span><br/><span className="policy-summary-2">{policy.paid ? "Si" : "No"}</span></span>
                                        <span className="policy-col"><span className="policy-summary-1">N° Visita</span><br/><span className="policy-summary-2">{policy.visit_count}</span></span>
                                        <span className="policy-col"><span className="policy-summary-1">Estatus</span><br/><span className="policy-summary-2">{policy.status}</span></span>
                                        <span className="policy-col"><span className="policy-summary-1">Valido desde</span><br/><span className="policy-summary-2">-</span></span>
                                        <span className="policy-col"><span className="policy-summary-1">Válida hasta</span><br/><span className="policy-summary-2">-</span></span>
                                    </div>
                                } 
                            />
                            <ListItemSecondaryAction>
                            
                            </ListItemSecondaryAction>
                        </ListItem>
                        );
                    })
                    }
                </List>
            }
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(PoliciesList)
