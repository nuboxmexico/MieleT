import React, { useState, useEffect } from 'react';

import { connect } from "react-redux"
import { createStructuredSelector } from "reselect"

import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useTranslation} from "react-i18next"

function QuotationVersions(props){
    const { t } = useTranslation('translation', { keyPrefix: 'services.quotes' });
    function downloadQuotation(resource_url){
        window.open(resource_url,'_newtab');
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    
	return (
		<React.Fragment>
            <Button className={props.btn_classname + " customers-scheddule-visit-link"} onClick={(e) => handleClick(e) }>
                <InputLabel id="pdf_version-simple-select-outlined-label" className=" mdl-navigation__link services-button"><i className="material-icons">history</i> {t('history')}</InputLabel>
            </Button>

            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                    {props.quotation.pdf_versions.map((pdf_version) => (
                        <MenuItem onClick={() => downloadQuotation(pdf_version.resource_url)} key={"pdf_version-"+pdf_version.id} value={pdf_version.id}>{pdf_version.name} - {pdf_version.person_accountable}</MenuItem>
                    ))}
            </Menu>
		   
		</React.Fragment>
	);
  
}

const structuredSelector = createStructuredSelector({
});
const mapDispatchToProps = {};

export default connect(structuredSelector, mapDispatchToProps)(QuotationVersions)

