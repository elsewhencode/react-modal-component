'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');
var ReactDom = require('react-dom');
var ReactTransitionGroup = require('react-addons-transition-group');
var TimeoutTransitionGroup = require('./TimeoutTransitionGroup');
var domEvents = require('attach-dom-events');
var selectParent = require('select-parent');

var attachEvents = domEvents.on;
var detachEvents = domEvents.off;

var PropTypes = React.PropTypes;
var validateClosePropTypes = function validateClosePropTypes(props, propName, componentName) {
    var propValue = props[propName];
    if (propValue != null && typeof propValue !== 'boolean') {
        return new Error('Expected a boolean for ' + propName + ' in ' + componentName + '.');
    }
    if (propValue && !props.close) {
        return new Error('Expected a function for prop `close` in ' + componentName + ', since prop `' + propName + '` is set true.');
    }
};

var Modal = React.createClass({
    displayName: 'Modal',

    propTypes: {
        appendTo: PropTypes.object,
        overlay: PropTypes.string,
        className: PropTypes.string,
        transitionName: PropTypes.string,
        transitionEnter: PropTypes.bool,
        transitionLeave: PropTypes.bool,
        transitionAppear: PropTypes.bool,
        enterTimeout: PropTypes.number,
        leaveTimeout: PropTypes.number,
        close: PropTypes.func,
        closeOnEsc: validateClosePropTypes,
        closeOnOutsideClick: validateClosePropTypes
    },

    getDefaultProps: function getDefaultProps() {
        return {
            appendTo: document.body,
            overlay: 'overlay',
            className: 'modal-dialog',
            transitionAppear: true,
            transitionEnter: true,
            transitionLeave: true,
            closeOnEsc: false,
            closeOnOutsideClick: false
        };
    },

    render: function render() {
        return null;
    },

    componentDidMount: function componentDidMount() {
        this.node = document.createElement('div');
        this.node.className = this.props.overlay;
        this.props.appendTo.appendChild(this.node);
        ReactDom.render(React.createElement(_Modal, this.props), this.node);
        if (this.props.closeOnOutsideClick) {
            attachEvents(this.node, {
                'click': this._closeOnOutsideClick
            });
        }
        if (this.props.closeOnEsc) {
            attachEvents(document.body, {
                'keyup': this._closeOnEsc
            });
        }
    },

    _closeOnEsc: function _closeOnEsc(e) {
        if (e.keyCode === 27 && this.props.close) {
            this.props.close();
        }
    },

    _closeOnOutsideClick: function _closeOnOutsideClick(e) {
        if (!e.target.classList.contains(this.props.className) && !selectParent('.' + this.props.className, e.target) && this.props.close) {
            this.props.close();
        }
    },

    onTransitionEnd: function onTransitionEnd() {
        ReactDom.unmountComponentAtNode(this.node);
        document.body.removeChild(this.node);
        if (this.props.closeOnOutsideClick) {
            detachEvents(this.node, {
                'click': this._closeOnOutsideClick
            });
        }
        if (this.props.closeOnEsc) {
            detachEvents(document.body, {
                'keyup': this._closeOnEsc
            });
        }
        this.node = null;
    },

    componentWillUnmount: function componentWillUnmount() {
        if (this.props.transitionName) {
            ReactDom.render(React.createElement(_Modal, _extends({}, this.props, { children: null, onTransitionEnd: this.onTransitionEnd })), this.node);
        } else {
            this.onTransitionEnd();
        }
    }
});

var _Modal = React.createClass({
    displayName: '_Modal',


    render: function render() {
        var _props = this.props;
        var appendTo = _props.appendTo;
        var overlay = _props.overlay;
        var className = _props.className;
        var children = _props.children;
        var other = _objectWithoutProperties(_props, ['appendTo', 'overlay', 'className', 'children']);
        var key = 'modal-' + Math.random();
        var node;

        if (children) {
            node = React.createElement(
                'div',
                { key: key, className: className },
                children
            );
        } else {
            node = React.createElement('span', { key: key, style: { display: 'inline-block' } });
        }

        return React.createElement(
            TimeoutTransitionGroup,
            other,
            node
        );
    }
});

module.exports = Modal;