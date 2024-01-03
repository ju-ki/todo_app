import './App.css';

function App() {
  const test = "aaa";
  // const handleClick = ():void => {
  //   window.location.href = '/';
  // };

  return (
    <div className="App">
      Hello World
      <div
        role="button"
        tabIndex={0}
        className="test"
        // role="button"
        // tabIndex={0}
        // // onClick={() => handleClick()}
        // onKeyDown={() => handleClick()}
      >
        {test}
      </div>
      <button type="button" className="test">
        test2
      </button>
    </div>
  );
}

export default App;
