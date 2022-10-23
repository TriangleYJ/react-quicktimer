// basic react functional component
import './Board.css';
import React from 'react';

// expandable list jsx
const ExpandableList = (props) => {
    
    return (
        <div className="expandable-list">

            <div className="expandable-list-header">
                {/* <span className="expandable-list-header-index">
                    {props.index}
                </span> */}
                <input className="expandable-list-header-title"
                    value={props.title ? props.title : 'New Task ' + props.index}
                    onInput={e => props.onUpdateTitle(e.target.value)} />
                <span className="expandable-list-header-button">
                    <button onClick={props.onAdd}>Add</button>
                </span>
                <span className="expandable-list-header-button">
                    <button onClick={props.onDelete}>Delete</button>
                </span>
            </div>

            <div className="expandable-list-body">
                {props.children}
            </div>

        </div>
    );
}

// expandable list item jsx
const ExpandableListItem = (props) => {
    return (
        <div className="expandable-list-item">
            <input className="expandable-list-item-title"
                value={props.title ? props.title : 'New Item ' + props.index}
                onInput={e => props.onUpdateTitle(e.target.value)} />
            <span className="expandable-list-item-button">
                <button onClick={props.onDelete}>Delete</button>
            </span>
        </div>
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
            items: []
        });
        this.setState({lists: lists});
    }

    // delete list
    deleteList = (index) => {
        const lists = this.state.lists;
        lists.splice(index, 1);
        this.setState({lists: lists});
    }

    // update list title
    updateListTitle = (index, title) => {
        const lists = this.state.lists;
        lists[index].title = title;
        this.setState({lists: lists});
    }

    // add item
    addItem = (index) => {
        const lists = this.state.lists;
        lists[index].items.push({
            title: ''
        });
        this.setState({lists: lists});
    }

    // update item title
    updateItemTitle = (listIndex, itemIndex, title) => {
        const lists = this.state.lists;
        lists[listIndex].items[itemIndex].title = title;
        this.setState({lists: lists});
    }

    // delete item
    deleteItem = (listIndex, itemIndex) => {
        const lists = this.state.lists;
        lists[listIndex].items.splice(itemIndex, 1);
        this.setState({lists: lists});
    }

    // render
    render() {
        return (
            <div className="board">
                <div className="board-header">
                    <span className="board-header-title">
                        Board
                    </span>
                    <span className="board-header-button">
                        <button onClick={this.addList}>Add List</button>
                    </span>
                </div>
                <div className="board-body">
                    {this.state.lists.map((list, listIndex) => {
                        return (
                            <ExpandableList
                                key={listIndex}
                                index={listIndex}
                                title={list.title}
                                onAdd={() => this.addItem(listIndex)}
                                onDelete={() => this.deleteList(listIndex)}
                                onUpdateTitle={(title) => this.updateListTitle(listIndex, title)}
                                >
                                {list.items.map((item, itemIndex) => {
                                    return (
                                        <ExpandableListItem
                                        key={itemIndex}
                                        index={itemIndex}
                                        title={item.title}
                                        onDelete={() => this.deleteItem(listIndex, itemIndex)}
                                        onUpdateTitle={(title) => this.updateItemTitle(listIndex, itemIndex, title)}
                                        />
                                    );
                                })}
                            </ExpandableList>
                        );
                    })}
                </div>
            </div>
        );
    }

}



export default Board;

