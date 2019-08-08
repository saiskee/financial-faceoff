import React from 'react';
import Grid from '@material-ui/core/Grid/index';
import List from '@material-ui/core/List/index';
import ListItemIcon from '@material-ui/core/ListItemIcon/index';
import Checkbox from '@material-ui/core/Checkbox/index';
import Button from '@material-ui/core/Button/index';
import Paper from '@material-ui/core/Paper/index';
import {withTracker} from "meteor/react-meteor-data";
import {Questions} from "../../../api/links";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move/index';
import './TransferList.css';
import {intersection, not} from '../utils';


const SortableItem = SortableElement(({value, checked, toggle}) =>
  <li>
    <ListItemIcon>
      <Checkbox
        checked={checked.indexOf(value) !== -1}
        tabIndex={-1}
        disableRipple
        onClick={() => toggle(value)}/>
    </ListItemIcon>
    <span className={'itemtext'}>
      {value.text}
    </span>
  </li>
);

const SortableList = SortableContainer(({items, checked, toggle}) =>
  <List dense className={'scrolling-list'}>
    {items.map((value, index) => (
      <SortableItem key={`item-${index}`} index={index} value={value} checked={checked} toggle={toggle}/>
    ))}
  </List>
);

const styles = {
  paper: {
    padding: '10px'
  }
};

class TransferList extends React.Component {
  state = {
    left: [],
    right: [],
    checked: []
  };

  componentDidMount() {
    this.setState({left: this.props.questions})
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.questions.length !== this.state.left.length + this.state.right.length) {
      let new_questions = not(nextProps.questions, [...this.state.left, ...this.state.right]);
      this.setState({left: [...new_questions.reverse(), ...this.state.left,]});
    }
  }

  handleToggle = value => {
    const {checked} = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setState({checked: newChecked});
  };

  handleAllRight = () => {
    const {left, right} = this.state;
    this.setState({
      right: right.concat(left),
      left: []
    }, this.props.setSelected([...right, ...left]))
  };

  handleCheckedRight = () => {
    const {left, right, checked} = this.state;
    const leftChecked = intersection(checked, left);
    this.setState({
      right: right.concat(leftChecked),
      left: not(left, leftChecked),
      checked: not(checked, leftChecked)
    }, this.props.setSelected([...right, ...leftChecked]));
  };

  handleCheckedLeft = () => {
    const {left, right, checked} = this.state;
    const rightChecked = intersection(checked, right);

    this.setState({
      left: left.concat(rightChecked),
      right: not(right, rightChecked),
      checked: not(checked, rightChecked)
    }, this.props.setSelected(not(right, rightChecked)));
  };

  handleAllLeft = () => {
    const {left, right} = this.state;
    this.setState({
      left: left.concat(right),
      right: []
    }, this.props.setSelected([]));
  };

  leftList = (items) => {
    const {left, checked} = this.state;
    return (
      <Paper style={styles.paper}>
        <h2>My Questions ({this.state.left.length})</h2>
        <h4>Selected: {intersection(checked, left).length}</h4>
        <SortableList items={items} onSortEnd={({oldIndex, newIndex}) => {
          this.setState(({left}) => ({
            left: arrayMove(left, oldIndex, newIndex),
          }));
        }} checked={this.state.checked} toggle={this.handleToggle}/>
      </Paper>
    )
  };

  rightList = (items) => {
    const {right, checked} = this.state;
    return (
      <Paper style={styles.paper}>
        <h2>Questions in Game ({this.state.right.length})</h2>
        <h4>Selected: {intersection(checked, right).length}</h4>
        <SortableList items={items} onSortEnd={({oldIndex, newIndex}) => {
          this.setState(({right}) => ({
            right: arrayMove(right, oldIndex, newIndex),
          }));
        }} checked={this.state.checked} toggle={this.handleToggle}/>
      </Paper>
    )
  };

  render() {
    const {checked, left, right} = this.state;
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    return (
      <Grid container spacing={3} className={'TransferList'}>
        <Grid item xs>{this.leftList(left)}</Grid>
        <Grid item>
          <Paper style={styles.paper}>
            <Grid container direction="column" alignItems="center">
              <Button
                variant="outlined"
                size="small"
                onClick={this.handleAllRight}
                disabled={left.length === 0}
                aria-label="move all right">
                ≫
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={this.handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right">
                &gt;
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={this.handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left">
                &lt;
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={this.handleAllLeft}
                disabled={right.length === 0}
                aria-label="move all left">
                ≪
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs>{this.rightList(right)}</Grid>
      </Grid>
    )
  }
}

export default withTracker(() => {
  return {
    questions: Questions.find({user_id: Meteor.userId()}, {sort: {'updatedAt': -1}}).fetch()
  }
})(TransferList);
