import React from 'react';
import {withRouter} from "react-router";
import * as ReactDOM from "react-dom";

class ReactFitText extends React.Component{

    componentDidMount() {
        window.addEventListener("resize", this._onBodyResize);
        this._onBodyResize();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this._onBodyResize);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this._onBodyResize();
    }

    // componentDidUpdate() {
    //     this._onBodyResize();
    // }

    _onBodyResize = function() {
        var element = this;
        var width = element.offsetWidth;
        element.style.fontSize = Math.max(
            Math.min((width / (this.props.compressor*10)),
                parseFloat(this.props.maxFontSize)),
            parseFloat(this.props.minFontSize)) + 'px';
    }

    _renderChildren = function(){
        var _this = this;

        return this.props.children;
    }

    render() {
        console.log(this._renderChildren())
        return (<React.Fragment>this._renderChildren()</React.Fragment>);
    }
}
export default withRouter(ReactFitText);
