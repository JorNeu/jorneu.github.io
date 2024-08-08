import React from "react";
import Typed from "react-typed";
import pdfcv from '../images/JorgeNeuendorfV.pdf';
import "./stars.scss";

class Intro extends React.Component {
    render() {
        return (
          <div id="home" className="intro route bg-image background">
            <div id="stars" />
            <div id="stars2" />
            <div id="stars3" />
    
            <div className="intro-content display-table">
              <div className="table-cell">
                <div className="container">
                  <h1 className="intro-title mb-4">Hola, Soy Jorge, me dicen jor c:</h1>
                  <p className="intro-subtitle">
                    <span className="text-slider-items"></span>
                    <strong className="text-slider">
                      <Typed
                        strings={[
                          "Backend Developer...",
                          "Bueno... Y un poco de Frontend también...",
                          "Me apasiona el desarrollo de Software!"
                        ]}
                        typeSpeed={80}
                        backDelay={1100}
                        backSpeed={30}
                        loop
                      />
                    </strong>
                  </p>
                  <p className="pt-3">
                    <a
                      className="btn btn-primary btn js-scroll px-4 btn-intro"
                      href="https://github.com/JorNeu"
                      role="button">
                      Ver Proyectos
                    </a>
                    <a
                      className="btn btn-primary btn js-scroll px-4 btn-intro"
                      href = {pdfcv} target = "_blank"
                      role="button">
                      Descargar Mi CV
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
export default Intro