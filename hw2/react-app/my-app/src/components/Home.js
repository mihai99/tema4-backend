import React from 'react';
import {Typography,Card,CardContent,CardActions, Link} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    containerCards:{
        display: "flex",
        justifyContent: "space-around",
        marginTop: 30,

    },
    bigContainer: {
        margin: "146px auto",
        width: "80%",
    },
    first:{
        background: "#98d5bf7a",
        minWidth: 275,
    },
    second:{
        background: "#1b11b340",
        minWidth: 275,
    }
  });

function Home() { 
    const classes = useStyles();
    
    const preventDefault = (e) =>{
        // e.preventDefault()
    }

  return <div className = {classes.bigContainer}>
      <Typography variant="h4" component="h3">Welcome to the book universe, what you want to know about?</Typography>
      <div className={classes.containerCards}>
        <Card className={classes.first}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                All what you want to know about
                </Typography>
                <Typography variant="h5" component="h2">
                    Books
                </Typography>
            </CardContent>
            <CardActions>
                <Link href="/books" onClick={preventDefault} color="inherit">
                Learn more
                </Link>
            </CardActions>
        </Card>
        <Card className={classes.second}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                All what you want to know about
                </Typography>
                <Typography variant="h5" component="h2">
                    Authors
                </Typography>
            </CardContent>
            <CardActions>
                <Link href="/authors" onClick={preventDefault} color="inherit">
                Learn more
                </Link>
            </CardActions>
        </Card>
      </div>
      </div>;
}
 
export default Home;