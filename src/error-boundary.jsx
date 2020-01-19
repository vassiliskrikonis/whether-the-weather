import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return {
      error
    };
  }

  render() {
    if (this.state.error) {
      const errorStyles = {
        display: "inline-block",
        width: "100%",
        textAlign: "center"
      };
      return this.props.fallback ? (
        this.props.fallback
      ) : (
        <span style={errorStyles}>Error: {this.state.error.message}</span>
      );
    } else {
      return this.props.children;
    }
  }
}
