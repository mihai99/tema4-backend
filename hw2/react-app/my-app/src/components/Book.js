import React, {useState, useEffect} from 'react';
import {Typography,Card,CardContent,CardActions, Link} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
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
        flexWrap: "wrap"

    },
    bigContainer: {
        margin: "146px auto",
        width: "80%",
    },
    first:{
        background: "#98d5bf7a",
        minWidth: 275,
        margin: 10,
    },
    second:{
        background: "#1b11b340",
        minWidth: 275,
        maxWidth: 300,

    },
    content:{
        maxHeight:200,
        overflow: "hidden"
    }
  });

function Book() { 
    const classes = useStyles();
    const [book, setBook] = useState(null);
    
    useEffect(() => {
        console.log(window.location.pathname);
        fetch(window.location.pathname)
        .then((res) => res.json())
        .then(
            (result) => {
                console.log(result)
                let tmp = <Card className={classes.first}>
                <CardContent className={classes.content}>
                    <Typography variant="h5" component="h2">
                        {result.title}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {result.description}
                    </Typography>
                    {result.author &&
                    <Typography variant="body2" component="p">
                        Author: <Link href={`/authors/${result.author._id}`} onClick={preventDefault} color="inherit">
                                    {result.author.name}
                                </Link>
                    </Typography>

                    }
                </CardContent>
                
                </Card>
                setBook(tmp)
            }).catch((error)=> console.error(error))
        
    }, [])
   
    const preventDefault = (e) =>{
        // e.preventDefault()
    }

  return <div className = {classes.bigContainer}>
      <div className={classes.containerCards}>
        {book}
      </div>
      </div>;
}
 
export default Book;