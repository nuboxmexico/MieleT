import React from "react"
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import {withRouter} from 'react-router-dom';
import {connect} from "react-redux"
import {createStructuredSelector} from "reselect"
import {Box, Button, Typography, Container, SvgIcon} from "@material-ui/core";
import DataAnalyticsIcon from 'assets/data-icon.svg';
import { useTranslation } from 'react-i18next';

function Home(props) {
  const {t} = useTranslation();
  const dashboardUrl = "https://quicksight.aws.amazon.com/sn/auth/signin?qs-signin-user-auth=false&redirect_uri=https%3A%2F%2Fquicksight.aws.amazon.com%2Fsn%2Fstart%3Fqs-signin-user-auth%3Dfalse%26state%3DhashArgs%2523%26isauthcode%3Dtrue"

  return (
    <React.Fragment>
      <Box minWidth="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">

        <SvgIcon color="action" style={{fontSize: "100px"}}> <DataAnalyticsIcon /> </SvgIcon>
        <Typography style={{marginTop: 20}} variant="h4">{t('home.dashboard.title')}</Typography>
        <Typography style={{marginTop: 30}} color="textSecondary" variant="subtitle1">{t('home.dashboard.subTitle')}</Typography>
        <Button style={{marginTop: 30}} component="a" href={dashboardUrl} target="_blank" color="primary" size="large" variant="contained">{t('home.dashboard.quicksigthButton')}</Button>
      </Box>
    </React.Fragment>
  );
}

const structuredSelector = createStructuredSelector({});
const mapDispatchToProps = {};
export default withRouter(connect(structuredSelector, mapDispatchToProps)(Home));

