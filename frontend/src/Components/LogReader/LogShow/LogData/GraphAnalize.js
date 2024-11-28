import {Line} from "react-chartjs-2";

const GraphAnalize = (props) => {
    const getAvValue = (data) => {
        let summ = 0
        data.forEach(d => {
            summ += d
        })
        return summ/data.length
    }

    let data = {
        labels: props.time,
        color: "whitesmoke",
        datasets: [{
            data: props.data,
            label: "",
            borderColor: "#00ff00",
            fill: true,
            lineTension: 0.1
        }]
    }
    let options = {
        plugins: {
            legend: {
                display: false,
            },
            annotation: props.is_av==true?{
                annotations: props.data.length==0?[]:
                [
                    {
                        type: 'line',
                        yMin: getAvValue(props.data),
                        yMax: getAvValue(props.data),
                        borderColor: '#ff0000',
                        borderWidth: 4
                    }
                ],
            }:{}
        },
        scales:{
            y:{
                grid:{
                    color: "whiteSmoke"
                },
                suggestedMin:0,
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
    return <div className="graph_analize">
        <p className="graph_analize_title">{props.title}</p>
        <Line
            type="line"
            data={data} 
            options={options}
        />
    </div>
}
export default GraphAnalize