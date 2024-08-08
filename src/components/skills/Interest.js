import "animate.css/animate.min.css";
import React, { Component } from 'react';
import ScrollAnimation from 'react-animate-on-scroll';
import classes from './Interest.module.css';

class Interest extends Component {
  render() {
    return (
      <div className={classes.box} id="interest">
        <ScrollAnimation offset="0" animateIn="fadeInLeft" duration='2.4' animateOnce="true" initiallyVisible={true}>
          <span className={classes.head}>QUE HAGO?</span>
          <h2 className={classes.heading}>ALGO DE MI EXPERIENCIA</h2>
          <div className={classes.Interest}>
            <ScrollAnimation offset="0" animateIn="fadeInLeft" duration='2.4' animateOnce="true" initiallyVisible={true}>
              <div className={classes.web}>
                <h3>-DESARROLLO BACKEND</h3>
                <p>Principalmente en Java utilizando diversas tecnologías como Spring Framework, Maven-Gradle, Hibernate (ORM), JUnit </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation offset="0" animateIn="fadeInLeft" duration='2.4' animateOnce="true" initiallyVisible={true}>
              <div className={classes.app}>
                <h3>-DESARROLLO WEB</h3>
                <p>Me considero desarrollador FULL STACK, ya que desarrollé sitios web utilzando, HTML, CSS, Javascript, Y algo de Frameworks ReactJs/Angular.<br />
                  -Además, conozco muy bien diseño de bases de datos relacionales, y consultas en SQL
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation offset="0" animateIn="fadeInLeft" duration='2.4' animateOnce="true" initiallyVisible={true}>
              <div className={classes.app}>
                <h3>-DESARROLLO DE SERVICIOS SOAP/REST</h3>
                <p>-Desarrollo de diversos tipos de servicios soap y api rest, utilizando librerías como Apache Camel, tecnologías como Google Apigee, 
                  y Spring Boot, haciendo uso de token JWT y Spring Security. Mantenimiento del ESB en distintos entornos</p>
              </div>
            </ScrollAnimation>
          </div>
        </ScrollAnimation>
      </div>
    )
  }
}

export default Interest;