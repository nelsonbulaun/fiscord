import { ToastContainer, toast } from "react-toastify";


export const Notify = () =>
toast("New Message", {
  className:"bg-blue-200",
  position: "top-center",
  width:200,
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  
});

export default Notify;