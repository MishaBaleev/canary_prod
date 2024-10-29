import { Bar } from "react-chartjs-2";

const LogGraphCard = (props) => {
    let data = {
        labels: props.x_ticks,
        color: "whitesmoke",
        datasets: [{
            data: props.data,
            label: "",
            backgroundColor: "#00ff00",
            fill: true
        }] 
    }
    let options = {
        plugins: {
            legend: {
                display: false
            }
        },
        scales:{
            y:{
                grid:{
                    color: "whiteSmoke"
                },
                suggestedMin: 0, suggestedMax: props.max,
                ticks:{
                    color: "whitesmoke"
                }
            },
            x:{
                grid:{
                    color: "whitesmoke"
                },
                ticks:{
                    color: "whitesmoke"
                }
            }
        }
    }
    return <div className="card">
        <p className="title">{props.title}</p>
        <div className="graph_card">
            <Bar type="Bar" options={options} data={data}/>
        </div>
    </div>
}
export default LogGraphCard