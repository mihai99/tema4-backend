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
        maxWidth: 300,
        margin: 10,
    },
    second:{
        background: "#1b11b340",
        minWidth: 275,
        maxWidth: 300,
        margin: 10,

    },
    content:{
        maxHeight:200,
        overflow: "hidden"
    }
  });

function Authors() { 
    const classes = useStyles();
    const [authors, setAuthors] = useState([])
    const [htmlAuthors, setHtmlAuthors] = useState([])
    useEffect(() => {
        fetch("/authors")
        .then((res) => res.json())
        .then(
            (result) => {
                console.log(result)
                setAuthors(result)
            }).catch((error)=> console.error(error))
        
    }, [])
    useEffect(() => {
        let tmp = []
        authors.forEach(author =>{
            let tmpAuthor = <div key={author._id}>
                <Card className={classes.second}>
                <CardContent className={classes.content}>
                    <Typography variant="h5" component="h2">
                        {author.name}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {author.biography}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Link href={`/authors/${author._id}`} onClick={preventDefault} color="inherit">
                    Learn more
                    </Link>
                </CardActions>
                </Card>
            </div>
            tmp.push(tmpAuthor)
        })
        setHtmlAuthors(tmp)
    }, [authors])
    const preventDefault = (e) =>{
        // e.preventDefault()
    }

  return <div className = {classes.bigContainer}>
      <Typography variant="h4" component="h3">The following authors are availbale:</Typography>
      <div className={classes.containerCards}>
        {htmlAuthors}
      </div>
      </div>;
}
 
export default Authors;