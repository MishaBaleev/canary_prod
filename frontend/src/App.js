import "./App.scss";
import Header from "./Components/Header/Header";
import { useEffect, useState } from "react";
import Monitoring from "./Components/Monitoring/Monitoring";
import LogReader from "./Components/LogReader/LogReader";
import Modal from "./Components/Modal/Modal";
import { connect } from "react-redux";
import { updateModal } from "./AppSlice";
import Loading from "./Components/Loading/Loading";
import axios from "axios";
import { Chart } from "chart.js/auto";
import annotationPlugin from 'chartjs-plugin-annotation';

const App = (props) => {
  const [cur_cmp, setCmp] = useState(localStorage.getItem("cur_cmp")!=null?Number(localStorage.getItem("cur_cmp")):0)
  const [interface_ready, setIntReady] = useState(false)
  
  const cmps = [
    <Monitoring/>,
    <LogReader/>
  ]

  const changeCMP = (index) => {
    setCmp(index)
    localStorage.setItem("cur_cmp", index)
  }

  const checkBackend = () => {
    axios.get("http://127.0.0.1:8001/checkBack").then(response => {
      setIntReady(true)
    }).catch(() => {
      setTimeout(() => {checkBackend()}, 1000)
    })
  }

  useEffect(() => {
    Chart.register(annotationPlugin)
    checkBackend()
  }, [])

  return <div className="App">
    {((interface_ready === false)?<Loading/>:
      <Header changeCMP={changeCMP} cur_cmp={cur_cmp}/>
    )}
    {((interface_ready === false)?<Loading/>:
      (props.app.modal.title === "")?"":<Modal/>
    )}
    {((interface_ready === false)?<Loading/>:
      cmps[cur_cmp]
    )}
  </div>
}
const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
  "updateModal": (data) => dispatch(updateModal(data))
}}
export default connect(mapStateToProps, mapDispatchToProps)(App)