import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import { fetchNewsData } from './../../api/'; 

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));


export default function LatestNews() {
    const [news_data, set_data] = useState([])
    const classes = useStyles();
    useEffect(() => {
        const fetchMyAPI = async () => {
            const news_data = await fetchNewsData();
            set_data(news_data)
          };
       
          fetchMyAPI();
    }, [])

    return(
        <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="right"
      >
        <div className={classes.toolbar} />
        <h2>Latest News</h2>
        <Divider />
        <List>
          {news_data.length ? (news_data.map((item, index) => (
            <ListItem button key={item.guid}>
               <Link href={item.link} target="_blank" >
                     {item.title}
            </Link>
            </ListItem>
          ))) : null}
        </List>
        <Divider />
        
      </Drawer>
    )
}