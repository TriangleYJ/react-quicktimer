// basic react functional component
import './Board.css';
import React from 'react';
import { TextField, IconButton, Card, CardContent, List, ListItem, Divider, Typography, Button } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

// calculate between two times and return formatted string with mm:ss.ms
const calculateTime = (start, end) => {
    const neg = end < start;
    const diff = Math.abs(end - start);
    const ms = diff % 1000;
    const s = Math.floor(diff / 1000) % 60;
    const m = Math.floor(diff / 60000) % 60;
    return `${neg ? '-' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}


// expandable list jsx
const ExpandableList = (props) => {

    return (
        <ListItem className="expandable-list">

            <div className="expandable-list-header">
                {/* <span className="expandable-list-header-index">
                    {props.index}
                </span> */}
                <TextField className="expandable-list-header-title"
                    value={props.title}
                    variant="standard"
                    placeholder={'New Topic ' + props.index}
                    varient="standard"
                    onInput={e => props.onUpdateTitle(e.target.value)} />
                <span className="timer">
                    {props.timer}
                </span>
                <IconButton edge="end" aria-label="add" className="expandable-list-header-button" onClick={props.onAdd}>
                    <Add>Add</Add>
                </IconButton>
                <IconButton edge="end" aria-label="delete" className="expandable-list-header-button" onClick={props.onDelete}>
                    <Delete>Delete</Delete>
                </IconButton>
            </div>

            <div className="expandable-list-body">
                {props.children}
            </div>

        </ListItem>
    );
}

// expandable list item jsx
const ExpandableListItem = (props) => {
    return (
        <ListItem className="expandable-list-item" sx={{ ml: 4}}>
            <TextField className="expandable-list-item-title"
                value={props.title}
                placeholder={'New Task ' + props.index}
                variant="standard"
                onInput={e => props.onUpdateTitle(e.target.value)} />
            <TextField className="expandable-list-item-title"
                value={props.time}
                placeholder={'Expect (s)'}
                variant="standard"
                sx={{ width: 100, ml: 2 }}
                onInput={e => props.onUpdateTime(e.target.value)} />
            <IconButton edge="end" aria-label="delete"  className="expandable-list-item-button" onClick={props.onDelete}>
                <Delete>Delete</Delete>
            </IconButton>
        </ListItem>
    );
}

// board component
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lists: [

            ]
        };
    }

    // add list
    addList = () => {
        const lists = this.state.lists;
        lists.push({
            title: '',
            items: [],
            open: true
        });
        this.setState({ lists: lists });
    }

    // delete list
    deleteList = (index) => {
        const lists = this.state.lists;
        lists.splice(index, 1);
        this.setState({ lists: lists });
    }

    // update list title
    updateListTitle = (index, title) => {
        const lists = this.state.lists;
        lists[index].title = title;
        this.setState({ lists: lists });
    }

    // add item
    addItem = (index) => {
        const lists = this.state.lists;
        lists[index].items.push({
            title: ''
        });
        this.setState({ lists: lists });
    }

    // update item title
    updateItemTitle = (listIndex, itemIndex, title) => {
        const lists = this.state.lists;
        lists[listIndex].items[itemIndex].title = title;
        this.setState({ lists: lists });
    }

    // update item time
    updateItemTime = (listIndex, itemIndex, time) => {
        const lists = this.state.lists;
        lists[listIndex].items[itemIndex].time = time;
        this.setState({ lists: lists });
    }

    // delete item
    deleteItem = (listIndex, itemIndex) => {
        const lists = this.state.lists;
        lists[listIndex].items.splice(itemIndex, 1);
        this.setState({ lists: lists });
    }

    // render
    render() {
        return (
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <div className="board-header">
                        <Typography gutterBottom variant="h5" component="div">
                            Board
                        </Typography>
                    </div>
                    <List>
                        <div className="board-body">
                            {this.state.lists.map((list, listIndex) => {
                                return (
                                    <div>
                                        <Divider />
                                        <ExpandableList
                                            key={listIndex}
                                            index={listIndex}
                                            title={list.title}
                                            onAdd={() => this.addItem(listIndex)}
                                            onDelete={() => this.deleteList(listIndex)}
                                            onUpdateTitle={(title) => this.updateListTitle(listIndex, title)}
                                        >
                                        </ExpandableList>
                                        {list.items.map((item, itemIndex) => {
                                                return (
                                                    <ExpandableListItem
                                                        key={itemIndex}
                                                        index={itemIndex}
                                                        title={item.title}
                                                        onDelete={() => this.deleteItem(listIndex, itemIndex)}
                                                        onUpdateTitle={(title) => this.updateItemTitle(listIndex, itemIndex, title)}
                                                        onUpdateTime={(title) => this.updateItemTime(listIndex, itemIndex, title)}
                                                    />
                                                );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </List>
                    <span className="board-header-button">
                        <Button onClick={this.addList}>Add Topic</Button>
                    </span>
                </CardContent>
            </Card>
        );
    }

}



export default Board;

