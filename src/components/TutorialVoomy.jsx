import {
  FaArrowRight,
  FaArrowLeft,
  FaTimes
} from "react-icons/fa";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";


/* ======================================
   PASOS DEL TUTORIAL

   "elemento" debe coincidir con el
   atributo data-tutorial="..." que le
   pongas al elemento real en Home.jsx

   "posicion" es opcional: donde prefieres
   que aparezca la tarjeta respecto al
   elemento ("bottom" | "top" | "left" | "right").
   Si no cabe, el componente la reubica solo.
====================================== */

const pasos = [

  {
    elemento: "tutorial-chat",
    titulo: "Asistente de rutas",
    texto:
      "Aquí puedes escribir tu ubicación y destino para encontrar una ruta recomendada.",
    posicion: "right"
  },

  {
    elemento: "tutorial-ubicacion",
    titulo: "Usa tu ubicación actual",
    texto:
      "Toca este botón para usar tu ubicación actual como punto de partida, sin necesidad de escribirla.",
    posicion: "top"
  },

  {
    elemento: "tutorial-mapa",
    titulo: "Mapa interactivo",
    texto:
      "En esta sección podrás visualizar el recorrido del bus, paradas y caminatas.",
    posicion: "left"
  },

  {
    elemento: "tutorial-sidebar",
    titulo: "Menú principal",
    texto:
      "Desde este menú puedes acceder al mapa, información y crear nuevas conversaciones.",
    posicion: "right"
  },

  {
    elemento: "tutorial-perfil",
    titulo: "Perfil de usuario",
    texto:
      "Aquí puedes consultar tu información y cerrar sesión.",
    posicion: "bottom"
  }

];


const MARGEN = 8;       // espacio entre el resaltado y el borde del elemento
const SEPARACION = 14;  // separación entre el resaltado y la tarjeta


function TutorialVoomy({ cerrar }) {

  const [paso, setPaso] = useState(0);
  const [rect, setRect] = useState(null);
  const [alturaCaja, setAlturaCaja] = useState(null);

  const cajaRef = useRef(null);

  const actual = pasos[paso];
  const esPrimerPaso = paso === 0;
  const esUltimoPaso = paso === pasos.length - 1;

  /* ======================================
     UBICAR EL ELEMENTO ACTUAL EN PANTALLA
  ====================================== */

  useLayoutEffect(() => {
    const objetivo = document.querySelector(
      `[data-tutorial="${actual.elemento}"]`
    );

    if (!objetivo) {
      const tSinObjetivo = setTimeout(() => setRect(null), 0);
      return () => clearTimeout(tSinObjetivo);
    }

    objetivo.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    });

    const actualizarPosicion = () => {
      const medida = objetivo.getBoundingClientRect();

      setRect({
        top: medida.top,
        left: medida.left,
        width: medida.width,
        height: medida.height
      });
    };

    // pequeño delay para esperar el scrollIntoView
    const t = setTimeout(actualizarPosicion, 300);

    window.addEventListener("resize", actualizarPosicion);
    window.addEventListener("scroll", actualizarPosicion, true);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", actualizarPosicion);
      window.removeEventListener("scroll", actualizarPosicion, true);
    };
  }, [paso, actual.elemento]);

  /* ======================================
     MEDIR LA ALTURA REAL DE LA TARJETA
     (para que "top" apunte bien sin
     depender de un valor fijo estimado)
  ====================================== */

  useLayoutEffect(() => {
    if (cajaRef.current) {
      const altoMedido = cajaRef.current.offsetHeight;

      if (altoMedido && altoMedido !== alturaCaja) {
        setAlturaCaja(altoMedido);
      }
    }
  });

  /* ======================================
     BLOQUEAR SCROLL DE FONDO MIENTRAS DURA
  ====================================== */

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  /* ======================================
     AVANZAR / RETROCEDER / FINALIZAR
  ====================================== */

  const siguiente = () => {
    if (esUltimoPaso) {
      localStorage.setItem("tutorialVoomy", "true");
      cerrar();
      return;
    }

    setPaso((prev) => prev + 1);
  };

  const anterior = () => {
    if (esPrimerPaso) {
      return;
    }

    setPaso((prev) => prev - 1);
  };

  const omitir = () => {
    localStorage.setItem("tutorialVoomy", "true");
    cerrar();
  };

  /* ======================================
     CALCULAR POSICIÓN DE LA TARJETA
  ====================================== */

  const calcularEstiloTarjeta = () => {
    if (!rect) {
      // sin elemento visible: la centramos en pantalla
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      };
    }

    const anchoTarjeta = 300;
    const altoAprox = alturaCaja || 170; // altura real medida, con 170 como fallback inicial
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const espacioArriba = rect.top;
    const espacioAbajo = vh - (rect.top + rect.height);
    const espacioIzquierda = rect.left;
    const espacioDerecha = vw - (rect.left + rect.width);

    let posicion = actual.posicion || "bottom";

    // si la posición preferida no cabe, elegimos la que más espacio tenga
    const cabe = {
      bottom: espacioAbajo > altoAprox + SEPARACION,
      top: espacioArriba > altoAprox + SEPARACION,
      right: espacioDerecha > anchoTarjeta + SEPARACION,
      left: espacioIzquierda > anchoTarjeta + SEPARACION
    };

    if (!cabe[posicion]) {
      posicion = Object.keys(cabe).find((clave) => cabe[clave]) || "bottom";
    }

    const estilo = { position: "fixed" };

    if (posicion === "bottom") {
      estilo.top = rect.top + rect.height + SEPARACION;
      estilo.left = Math.min(
        Math.max(rect.left, 12),
        vw - anchoTarjeta - 12
      );
    } else if (posicion === "top") {
      estilo.top = rect.top - SEPARACION - altoAprox;
      estilo.left = Math.min(
        Math.max(rect.left, 12),
        vw - anchoTarjeta - 12
      );
    } else if (posicion === "right") {
      estilo.top = Math.min(
        Math.max(rect.top, 12),
        vh - altoAprox - 12
      );
      estilo.left = rect.left + rect.width + SEPARACION;
    } else {
      estilo.top = Math.min(
        Math.max(rect.top, 12),
        vh - altoAprox - 12
      );
      estilo.left = rect.left - SEPARACION - anchoTarjeta;
    }

    estilo.width = anchoTarjeta;
    estilo["--flecha"] = posicion;

    return estilo;
  };

  const estiloTarjeta = calcularEstiloTarjeta();

  /* ======================================
     ESTILO DEL RECUADRO RESALTADO
  ====================================== */

  const estiloResaltado = rect
    ? {
        top: rect.top - MARGEN,
        left: rect.left - MARGEN,
        width: rect.width + MARGEN * 2,
        height: rect.height + MARGEN * 2
      }
    : null;

  return (
    <div className="tutorial-overlay">

      {/* capa oscura con "agujero" alrededor del elemento */}
      {estiloResaltado && (
        <div
          className="tutorial-resaltado"
          style={estiloResaltado}
        />
      )}

      {!estiloResaltado && (
        <div className="tutorial-fondo-oscuro" />
      )}

      {/* tarjeta con la explicación */}
      <div
        ref={cajaRef}
        className={`tutorial-box tutorial-flecha-${estiloTarjeta["--flecha"] || "centro"}`}
        style={estiloTarjeta}
      >

        <button
          type="button"
          className="tutorial-close"
          onClick={omitir}
          aria-label="Cerrar tutorial"
        >
          <FaTimes />
        </button>

        <h3>{actual.titulo}</h3>

        <p>{actual.texto}</p>

        <div className="tutorial-footer">

          <button
            type="button"
            className="tutorial-omitir"
            onClick={omitir}
          >
            Omitir
          </button>

          <div className="tutorial-nav-buttons">

            {!esPrimerPaso && (
              <button
                type="button"
                className="tutorial-anterior"
                onClick={anterior}
              >
                <FaArrowLeft />
                
              </button>
            )}

            <button
              type="button"
              className="tutorial-next"
              onClick={siguiente}
            >
              {esUltimoPaso ? "Finalizar" : "Siguiente"}
              <FaArrowRight />
            </button>

          </div>

        </div>

        <div className="tutorial-counter">
          {paso + 1} / {pasos.length}
        </div>

      </div>
    </div>
  );
}

export default TutorialVoomy;