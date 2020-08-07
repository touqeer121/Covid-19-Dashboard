import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


const DatePicker  = (props) =>{

        const { defaultDate, label , changeDate} = props;
        const useStyles = makeStyles((theme) => ({
            container: {
              display: 'flex',
              flexWrap: 'wrap',
            },
            textField: {
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(1),
              width: 200,
            },
          }));
        const classes = useStyles();
        return(     
            <form className={classes.container} noValidate>
            <TextField
            id="date"
            label={label}
            type="date"
            defaultValue={defaultDate}
            className={classes.textField}
            onChange={(e)=>changeDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          </form>)
   
}

export default DatePicker;