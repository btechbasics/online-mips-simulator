import './App.css';
import React, { Component } from 'react';

import IDE from './container/IDE/ide';
import Navbar from './component/navbar/Navbar';
import Console from './component/console/Console'
import SideBar from './component/sidebar/SideBar'

import parser from './mips/parser'
import processor from './mips/operations'

class App extends Component{

  state={
    instructions: null
  }

  setFile = async (event)=>{
    let file = event.target.files[0];
    //creating a reader object
    var reader = new FileReader();
    //reading file
    var x = this;
    reader.onload = function() {
        console.log(reader.result);
         localStorage.setItem('result',String(reader.result));
         window.location.reload();
        //  x.showUploadAlert();
        //  setTimeout(this.showUploadAlert,5000);
    }
    
    reader.readAsText(file);
  }

  deleteFile=(event)=>{
    localStorage.removeItem("result");
    window.location.reload()
    // this.showCleanAlert();
  }

  assemble = () => {
    processor.reset()
    parser.reset()

    var textArea = localStorage.getItem("result")
    // console.log(textArea)
    this.setState({
      instructions: parser.parse(textArea)
    })

    if(!!parser.pointer.get("main")){
      processor.pc = parseInt(parser.pointer.get("main"))
    }
    else{
      processor.running = false
    }
    console.log("Assembled")
    console.log(parser.pointer)
    console.log(processor.pc)
    console.log(processor.memory)
  }

  execute = () => {
    if(!this.state.instructions) return;

    const run = window.setInterval(() => {
      if(!processor.running){
        console.log("END OF INSTRUCTIONS")
        window.clearInterval(run)
        return
      }
      this.stepRun()
      
    }, 0)
  }

  stepRun = () => {
    console.clear()
    console.log("PC = " + processor.pc)
    if(!this.state.instructions) return;
    if(!processor.running){
      console.log("END OF INSTRUCTIONS")
      return
    }

    processor.execute(this.state.instructions[processor.pc])

    console.log(processor.registers)
    console.log(processor.memory)
    this.setState({
      instructions:this.state.instructions
    })
    processor.pc += 1
    
    console.log("parser is");
      console.log(parser);
      console.log("processor is");
      console.log(processor);
  }


  render=()=>{
    return(
      <div className="App">
        <SideBar pc={processor.pc} registers = {processor.registers} />
        <div style={{width: '100%'}}>
          <Navbar 
            setFile = {this.setFile} 
            deleteFile = {this.deleteFile} 
            assemble = {this.assemble} 
            execute = {this.execute}
            stepRun = {this.stepRun}
          />
          <IDE/>
          <Console />
        </div>
      </div>
    )
  }
}

export default App;