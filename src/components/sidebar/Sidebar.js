import React, { Component } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import logo from '../images/My-logo4.ico';
import './Sidebar.css';

class Sidebar extends Component {
    render() {
       
        return (
            <div className="sidebar">
                <img src={logo} />
                <h1><Link smooth to="/#start" className="h1_links">Jorge Emanuel Neuendorf</Link></h1>
                <p style={{color:'black',fontWeight:'bold'}} className="gmail"> jorgeeneuendorf@gmai.com </p>
                <ul className="sidebar-nav">
                    <li className="sidebar-nav-items"><Link smooth to="/#about" className="links">Sobre Mi</Link></li>
                    <li className="sidebar-nav-items"><Link smooth to="/#interest" className="links">Interés</Link></li>
                    <li className="sidebar-nav-items"><Link smooth to="/#education" className="links" >Educacion</Link></li>
                    {/* <li className="sidebar-nav-items"><a href="http://www.bloggingpeek.com" target="_blank" rel="opener noreferrer" className="links"> Blog<FiExternalLink/></a></li> */}
                </ul>
    
                <div className="flip-card-back">
                    <ul className="sidebar-nav">
                        <li className="sidebar-nav-icons"><a href="https://ar.linkedin.com/in/jorgeeneuendorf" rel="opener noreferrer" target="https://ar.linkedin.com/in/jorgeeneuendorf" class="fa fas fa-linkedin fa-lg"></a></li>
                        <li className="sidebar-nav-icons"> <a href="https://github.com/JorNeu" rel="opener noreferrer" target="https://github.com/JorNeu" class="fa fas fa-github fa-lg"></a></li>
                        <li className="sidebar-nav-icons"> <a href="https://www.instagram.com/shorsh.sz/" rel="opener noreferrer" target="https://www.instagram.com/shorsh.sz/" class="fa fas fa-instagram fa-lg"></a></li>
                        <li className="sidebar-nav-icons"> <a href="mail:jorgeeneuendorf@gmai.com" rel="opener noreferrer" target="_blank" class="fa fas fa-envelope fa-lg"></a></li>
                    </ul>
                </div>
              
            </div>
        )
    }
}
export default Sidebar