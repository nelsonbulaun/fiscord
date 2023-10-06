import {createPortal} from 'react-dom'

const Modal = (props) => {
  if (!props.show) return null;
  return createPortal(
    <div className="mymodal rounded-lg m-1 p-2 backdrop-blur" id="invite">
      <div className="mymodal-content">
        {/* <div className="mymodal-header">
          <div className="mymodal-title invisible">
            {props.title}
            </div> */}
            <div className="mymodal-content">{props.children}</div>
            <div className="mymodal-footer">
              <button onClick={props.onClose} className="button fit-content">
                Close
              </button>
         
          {/* </div> */}
        </div>
      </div>
    </div>,
    document.getElementById('root')
  );
};

export default Modal