import React from 'react';
import styles from './Modal.css';


// export default class Modal extends React.Component {
//   constructor(props) {
//     super(props);

//     this.onClick = this.onClick.bind(this);
//   }

//   render() {
//     return (
//       <div className='modal-wrap'>
//         <div className='modal-window'>
//           <div className='modal-content'>
//           { this.props.children }
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

export default function Modal(props) {
  return (
    <div className='modal-wrap'>
      <div className='modal-window'>
        <div className='modal-content'>
        { props.children }
        </div>
      </div>
    </div>
  );
}