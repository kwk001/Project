class LowcodeComponent extends Component {
  state = {
    "text": "outer",
    "isShowDialog": false
  }
  componentDidMount() {
    console.log('did mount');
  }
  componentWillUnmount() {
    console.log('will unmount');
  }
  
}