import React, {useState, useEffect} from 'react';
import {Typography,Card,CardContent, Link} from '@material-ui/core';
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
    second:{
        background: "#1b11b340",
        minWidth: 275,

    },
    content:{
        maxHeight:200,
        overflow: "hidden"
    }
  });

function Author() { 
    const classes = useStyles();
    const [author, setAuthor] = useState(null);
    
    useEffect(() => {
        console.log(window.location.pathname);
        fetch(window.location.pathname)
        .then((res) => res.json())
        .then(
            (result) => {
                console.log(result)
                let tmp = <Card className={classes.second}>
                <CardContent className={classes.content}>
                    <Typography variant="h5" component="h2">
                        {result.name}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {result.biography}
                    </Typography>
                    {result.books && result.books.length &&
                    <div>
                        <h3>Books({result.books.length}):</h3>
                        {result.books.map(book =>
                            {
                                console.log(book);
                                return (<Typography  component="p" key={book._id}>
                                    <Link href={`/books/${book._id}`} onClick={preventDefault} color="inherit">
                                        {book.title}
                                    </Link>
                                </Typography>)
                            }
                        )}
                    </div>

                    }
                </CardContent>
                
                </Card>
                setAuthor(tmp)
            }).catch((error)=> console.error(error))
        
    }, [])
   
    const preventDefault = (e) =>{
        // e.preventDefault()
    }

  return <div className = {classes.bigContainer}>
      <div className={classes.containerCards}>
        {author}
      </div>
      </div>;
}
 
export default Author;