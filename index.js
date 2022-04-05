function App(){

  const [displayTime,setDisplayTime] = React.useState(25 *  60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [breakAudio, setBreakAudio] = React.useState(new Audio("./alarm.mp3"));
  
  const playBreakSound = () => {
    breakAudio.currentTime = 0;
    breakAudio.play();
  }

  const formatTime = (time) => {
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return ( 
      (minutes < 10 ? "0" + minutes : minutes) + ":" +
      (seconds < 10 ? "0" + seconds: seconds)
    );
  };

  const changeTime = (amount, type) => {
    if(type == 'break'){
      if(sessionTime <= 60 && amount < 0){
        return;
      }
      setBreakTime((prev) => prev + amount);
    }else{
      if(sessionTime <= 60 && amount < 0){
      return;
    }
      setSessionTime((prev) => prev + amount);
      if(!timerOn){
        setDisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if (!timerOn){
      let interval = setInterval(()=> {
          date=new Date().getTime();
          if (date > nextDate) {
            setDisplayTime((prev) => {
                if (prev <= 0 && !onBreakVariable){
                  playBreakSound();
                  onBreakVariable=true;
                  setOnBreak(true)
                  return breakTime;
                }else if(prev <=0 && onBreakVariable){
                  playBreakSound();
                  onBreakVariable=false;
                  setOnBreak(false)
                  return sessionTime;
                }
                return prev -1;
            });
            nextDate += second;
          }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
    };
    

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };

  return (
    <div class="center-div">
      <h1>Pomodoro Clock</h1>
      <div className="dual-container">
      <Length title={"break length"} changeTime={changeTime} type={"break"} time={breakTime} formatTime={formatTime}></Length>
      <Length title={"session length"} changeTime={changeTime} type={"session"} time={sessionTime} formatTime={formatTime}></Length>
      </div>
    <h3>{onBreak ? "Break" : "Session"}</h3>
    <h1>{formatTime(displayTime)}</h1>
    <button className="btn" onClick={controlTime}>{timerOn ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-pause-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"/>
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-play-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
      </svg>  
    ) 
    
    }</button>
    <button className="btn" onClick={resetTime}>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
      <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
      </svg>
    </button>
    </div>
  );
  
}

function Length({ title,changeTime, type, time, formatTime }) {
  return (
    <div>
      <h3>{title}</h3>
      <div className="time-sets">
        <button className="btn" onClick={() => changeTime(-60,type)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-arrow-down-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
          </svg>
        </button>
        <h3>{formatTime(time)}</h3>
        <button className="btn" onClick={() => changeTime(60,type)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-arrow-up-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'))