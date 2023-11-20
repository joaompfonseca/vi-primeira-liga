import React from 'react';
import {CircularProgress, Typography, Grid} from '@mui/material';

const LoadingComponent = () => {
    return (
        <Grid container direction="column" alignItems="center" justifyContent="center" style={{height: "100%"}}>
            <CircularProgress/> {/* Display the circular progress indicator */}
            <Typography variant="body1">Loading...</Typography> {/* Optional loading text */}
        </Grid>
    );
};

export default LoadingComponent;