import "animate.css/animate.min.css";
import React, { Component } from 'react';
import ScrollAnimation from 'react-animate-on-scroll';
import { MdComputer, MdGTranslate, MdSchool } from 'react-icons/md';
import classes from './Education.module.css';

class Education extends Component {
    render() {
        return (
            <div className={classes.box} id="education">
                <ScrollAnimation offset="0" animateIn="fadeInLeft" duration='2' animateOnce="true" initiallyVisible={true}>
                    <h2 className={classes.heading}>FORMACION</h2>
                    <section className={classes.container}>
                        <div className={classes.container_content}>
                            <div className={classes.row}>
                                <div className={classes.row_md_12}>
                                    <div className={classes.timeline_centered}>
                                        <ScrollAnimation offset="0" animateIn="fadeInLeft" duration='2.4' animateOnce="true" initiallyVisible={true}>
                                            <article className={classes.timeline_entry}>
                                                <div className={`${classes.timeline_icon} ${classes.timeline_icon_1}`} >
                                                    <MdSchool />
                                                </div>
                                                <div className={classes.label}>
                                                    <h2 >Universidad Nacional De La Plata (UNLP)  <span>2023-actual</span></h2>
                                                    <p>Analista programador universitario - Adquisición de conocimientos sólidos de programación </p>
                                                </div>
                                            </article>
                                        </ScrollAnimation>
                                        <ScrollAnimation offset="0" animateIn="fadeInLeft" duration='2.4' animateOnce="true" initiallyVisible={true}>
                                            <article className={classes.timeline_entry}>
                                            <div className={`${classes.timeline_icon} ${classes.timeline_icon_1}`} >
                                                    <MdSchool />
                                                </div>
                                                <div className={classes.label}>
                                                    <h2 >Codo a Codo <span>2024-Finalizado</span></h2>
                                                    <p>Java FullStack (sprinboot) - Refuerzo y nuevas practicas mas orientado al backend </p>
                                                </div>
                                            </article>
                                        </ScrollAnimation>
                                        <ScrollAnimation offset="0" animateIn="fadeInLeft" duration='2.4' animateOnce="true" initiallyVisible={true}>
                                            <article className={classes.timeline_entry}>
                                            <div className={`${classes.timeline_icon} ${classes.timeline_icon_2}`} >
                                                    <MdComputer />
                                                </div>
                                                <div className={classes.label}>
                                                    <h2 >Técnico en Armado y Reparación de PC.</h2>
                                                    <p>Realicé diversos cursos de armado y reparación de
                                                        PC en mis inicios (Año 2019)
                                                    </p>
                                                </div>
                                            </article>
                                        </ScrollAnimation>
                                        <ScrollAnimation offset="0" animateIn="fadeInLeft" duration='2.4' animateOnce="true" initiallyVisible={true}>
                                            <article>
                                                <div className={`${classes.timeline_icon} ${classes.timeline_icon_4}`} >
                                                    <MdGTranslate />
                                                </div>
                                                <div className={classes.label}>
                                                    <h2 >IDIOMAS</h2>
                                                    <p>Español -Nativo
                                                    </p>
                                                    <p>Inglés Oral - BASICO // Inglés Lectura - INTERMEDIO
                                                    </p>
                                                </div>
                                                <div className={classes.timeline_entry_inner}><div className={classes.timeline_icon_3 || classes.color_none}></div></div>
                                            </article>
                                        </ScrollAnimation>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </ScrollAnimation>
            </div>

        )
    }
}

export default Education;
