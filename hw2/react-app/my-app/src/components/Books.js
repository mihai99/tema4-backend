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

    },
    content:{
        maxHeight:200,
        overflow: "hidden"
    }
  });

function Books() { 
    const classes = useStyles();
    const [books, setBooks] = useState([])
    const [htmlBooks, setHtmlBooks] = useState([])
    useEffect(() => {
        fetch("/books")
        .then((res) => res.json())
        .then(
            (result) => {
                console.log(result)
                setBooks(result)
            }).catch((error)=> console.error(error))
        
    }, [])
    useEffect(() => {
        let tmp = []
        books.forEach(book =>{
            let tmpBook = <div key={book._id}>
                <Card className={classes.first}>
                <CardContent className={classes.content}>
                    <Typography variant="h5" component="h2">
                        {book.title}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {book.description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Link href={`/books/${book._id}`} onClick={preventDefault} color="inherit">
                    Learn more
                    </Link>
                </CardActions>
                </Card>
            </div>
            tmp.push(tmpBook)
        })
        setHtmlBooks(tmp)
    }, [books])
    const preventDefault = (e) =>{
        // e.preventDefault()
    }

  return <div className = {classes.bigContainer}>
      <Typography variant="h4" component="h3">The following books are availbale:</Typography>
      <div className={classes.containerCards}>
        {htmlBooks}
      </div>
      </div>;
}
 
export default Books;