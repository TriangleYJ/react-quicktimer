// basic react functional component
import './Board.css';
import React from 'react';
import { Box, TextField, IconButton, Card, CardContent, List, ListItem, Divider, Typography, Button } from '@mui/material';
import { Add, Delete, PlayArrow, Pause, KeyboardArrowDownSharp, KeyboardArrowUpSharp } from '@mui/icons-material';

// calculate between two times and return formatted string with mm:ss.ms
const calculateTime = (start, end) => {
    return formatTime(end-start);
}

const formatTime = (sdiff, ismin) => {
    let smdiff = sdiff * (ismin ? 60000 : 1);
    let neg = smdiff < 0;
    let diff = Math.abs(smdiff);
    const ms = diff % 1000;
    const s = Math.floor(diff / 1000) % 60;
    const m = Math.floor(diff / 60000) % 60;
    const h = Math.floor(diff / 3600000);
    return `${neg ? '-' : ''}${h ? h.toString()+':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}${!ismin ? '.' + ms.toString().padStart(3, '0') : ''}`;
}

const text2Format = (min, ismin) => {
    const a = parseInt(min);
    if(isNaN(a)) return undefined;
    return formatTime(a, ismin);
}

const sumTexts2Format = (texts, ismin) => {
    let sum = 0;
    for(let i = 0; i < texts.length; i++) {
        const a = parseInt(texts[i]);
        if(isNaN(a)) return undefined;
        sum += a;
    }
    return formatTime(sum, ismin);
}

// expandable list jsx
const ExpandableList = (props) => {

    return (
        <Right2TextsWrapper 
            text1={sumTexts2Format(props.list.items.map(x => x.time), true) ?? 'Invalid'}
            text2={sumTexts2Format(props.list.items.map(x => x.currTime))}>
            <ListItem className="expandable-list">
                <Box>
                    {/* <span className="expandable-list-header-index">
                    {props.index}
                </span> */}
                    <TextField className="expandable-list-header-title"
                        value={props.list.title}
                        variant="standard"
                        placeholder={'New Topic ' + props.index}
                        varient="standard"
                        onInput={e => props.onUpdateTitle(e.target.value)} />
                    <IconButton onClick={props.onAdd}>
                        <Add>Add</Add>
                    </IconButton>
                    <IconButton onClick={props.onDelete}>
                        <Delete>Delete</Delete>
                    </IconButton>
                    <IconButton onClick={props.onUpdateOpen}>
                        {props.list.open ? <KeyboardArrowUpSharp>Up</KeyboardArrowUpSharp> : <KeyboardArrowDownSharp>Down</KeyboardArrowDownSharp>}
                    </IconButton>

                </Box>
            </ListItem>
        </Right2TextsWrapper>
    );
}

// expandable list item jsx
const ExpandableListItem = (props) => {
    return (
        <Right2TextsWrapper
            text1={text2Format(props.item.time, true) ?? 'Invalid'}
            text2={text2Format(props.item.currTime)}>
            <ListItem className="expandable-list-item">
                <Box sx={{ ml: 4, display: 'flex' }}>
                    <TextField className="expandable-list-item-title"
                        value={props.item.title}
                        placeholder={'New Task ' + props.index}
                        variant="standard"
                        onInput={e => props.onUpdateTitle(e.target.value)} />
                    <TextField className="expandable-list-item-title"
                        value={props.item.time}
                        placeholder={'Expect (m)'}
                        variant="standard"
                        sx={{ width: 80, ml: 2 }}
                        onInput={e => props.onUpdateTime(e.target.value)} />
                    <IconButton onClick={props.onToggleTimer}>
                        {props.item.counter ? <Pause>Pause</Pause> : <PlayArrow>Play</PlayArrow>}
                    </IconButton>
                    <IconButton onClick={props.onDelete}>
                        <Delete>Delete</Delete>
                    </IconButton>
                </Box>
            </ListItem>
        </Right2TextsWrapper>
    );
}

const Right2TextsWrapper = (props) => {
    return (
        <Box className="right2-texts-wrapper" sx={{ justifyContent: 'space-between', display: 'flex' }}>
            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                {props.children}
            </Box>

            <Box sx={{ alignItems: 'center', display: 'flex' }}>
                <Typography sx={{ m: 1, fontWeight: props.bold ? 'bold' : 'regular', width: 80 }}>{props.text1}</Typography>
                <Typography sx={{ m: 1, fontWeight: props.bold ? 'bold' : 'regular', width: 80, color: props.text2[0] === '-' ? 'red' : 'initial' }}>{props.text2}</Typography>
            </Box>
        </Box>
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
            open: true,
        });
        this.setState({ lists: lists });
    }

    // delete list
    deleteList = (index) => {
        if(window.confirm('Are you sure you want to delete this list?')){
            const lists = this.state.lists;
            lists.splice(index, 1);
            this.setState({ lists: lists });
        }
    }

    // update list title
    updateListTitle = (index, title) => {
        const lists = this.state.lists;
        lists[index].title = title;
        this.setState({ lists: lists });
    }

    updateListOpen = (index, open) => {
        const lists = this.state.lists;
        lists[index].open = open;
        this.setState({ lists: lists });
    }

    // add item
    addItem = (index) => {
        const lists = this.state.lists;
        lists[index].open = true;
        lists[index].items.push({
            title: '',
            time: '',
            currTime: 0,
            stackTime: null,
            counter: null,
            counterTime: 0,
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

    // update item currTime
    updateItemCurrTime = (listIndex, itemIndex, currTime) => {
        const lists = this.state.lists;
        if(lists[listIndex].items[itemIndex].currTime > 0 && currTime <= 0) {
            let audio = new Audio(`https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3`);
            audio.volume = 0.3;
            audio.play();
            setTimeout(() => audio.play(), 800);
            setTimeout(() => audio.play(), 1600);
        }
        lists[listIndex].items[itemIndex].currTime = currTime;
        this.setState({ lists: lists });
    }

    // delete item
    deleteItem = (listIndex, itemIndex) => {
        if(window.confirm('Are you sure you want to delete this item?')){
            const lists = this.state.lists;
            lists[listIndex].items.splice(itemIndex, 1);
            this.setState({ lists: lists });
        }
    }

    exportRecord = () => {
        const lists = this.state.lists;
        let record = '';
        lists.forEach((list, listIndex) => {
            record += 'Topic ' + list.title + '\n';
            list.items.forEach((item, itemIndex) => {
                record += item.title + ' ' + formatTime(item.time, true) + ' ' + formatTime(item.currTime) + '\n';
            });
            record += '\n';
        });
        navigator.clipboard.writeText(record);
        alert('Record copied to clipboard!');
    }


    toggleTimer = (listIndex, itemIndex) => {
        // time: original immutable value, stackTime: mutable ms value, currTime: display time
        const lists = this.state.lists;
        // lists[listIndex].items[itemIndex].counter = counter;

        let counter = lists[listIndex].items[itemIndex].counter

        if (counter) {
            clearInterval(counter);
            lists[listIndex].items[itemIndex].counter = null;
            const diff = new Date().getTime() - lists[listIndex].items[itemIndex].counterTime;
            lists[listIndex].items[itemIndex].stackTime -= diff;
        } else {
            if(lists[listIndex].items[itemIndex].stackTime == null){
                const a = parseInt(lists[listIndex].items[itemIndex].time);
                if(isNaN(a) || a <= 0) {
                    alert('Invalid time');
                    return;
                }
                lists[listIndex].items[itemIndex].stackTime = a * 60 * 1000;
            }

            lists[listIndex].items[itemIndex].counterTime = new Date().getTime();
            lists[listIndex].items[itemIndex].counter = setInterval(() => {
                // TODO: cannot read properties of undefined (reading 'counterTime')
                const diff = new Date().getTime() - lists[listIndex].items[itemIndex].counterTime;
                this.updateItemCurrTime(listIndex, itemIndex, lists[listIndex].items[itemIndex].stackTime - diff);
            }, 50);
        }

        this.setState({ lists: lists });
    }

    // render
    render() {
        return (
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <div className="board-header">
                        <Right2TextsWrapper text1="Goal" text2="Diff" bold>
                            <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 'bold'}}>
                                Record
                            </Typography>
                        </Right2TextsWrapper>
                        <Right2TextsWrapper 
                            text1={sumTexts2Format(this.state.lists.map(list => list.items.map(x => x.time)).flat(), true) ?? 'Invalid'} 
                            text2={sumTexts2Format(this.state.lists.map(list => list.items.map(x => x.currTime)).flat())}>
                            <Typography>
                                Total Time
                            </Typography>
                        </Right2TextsWrapper>
                    </div>
                    <List>
                        <div className="board-body">
                            {this.state.lists.map((list, listIndex) => {
                                return (
                                    <div key={listIndex}>
                                        <Divider />
                                        <ExpandableList
                                            key={listIndex}
                                            index={listIndex}
                                            list={list}
                                            onAdd={() => this.addItem(listIndex)}
                                            onDelete={() => this.deleteList(listIndex)}
                                            onUpdateTitle={(title) => this.updateListTitle(listIndex, title)}
                                            onUpdateOpen={() => this.updateListOpen(listIndex, !list.open)}
                                        >
                                        </ExpandableList>
                                        {list.items.map((item, itemIndex) => {
                                            return list.open ? (
                                                <ExpandableListItem
                                                    key={itemIndex}
                                                    index={itemIndex}
                                                    item={item}
                                                    onDelete={() => this.deleteItem(listIndex, itemIndex)}
                                                    onUpdateTitle={(title) => this.updateItemTitle(listIndex, itemIndex, title)}
                                                    onUpdateTime={(time) => this.updateItemTime(listIndex, itemIndex, time)}
                                                    onToggleTimer={() => this.toggleTimer(listIndex, itemIndex)}
                                                />
                                            ) : null;
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </List>
                    <span className="board-header-button">
                        <Button onClick={this.addList}>Add Topic</Button>
                    </span>
                    <span className="board-header-button">
                        <Button onClick={this.exportRecord}>Export Record</Button>
                    </span>
                </CardContent>
            </Card>
        );
    }

}



export default Board;

