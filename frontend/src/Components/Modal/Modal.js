import { useEffect } from "react";
import { updateModal } from "../../AppSlice";
import "./Modal.scss";
import { connect } from "react-redux";

const Modal = (props) => {
    useEffect(() => {
        setTimeout(() => {props.updateModal({title: "", message: ""})}, 5000)
    }, [props.app.modal])
    return <div className="modal">
        <button className="close_modal" onClick={() => {props.updateModal({title: "", message: ""})}}></button>
        <div className="title">
            <p>{props.app.modal.title}</p>
        </div>
        <div className="message">
            <p>{props.app.modal.message}</p>
        </div>
    </div>
}
const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateModal": (data) => dispatch(updateModal(data))
}}
export default connect(mapStateToProps, mapDispatchToProps)(Modal)