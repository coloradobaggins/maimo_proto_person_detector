/**
 * Modulo singleton.
 * Face-api.js usa APIs del browser y no se puede importar estaticamente como los demas modulos en el inicio de los archivos.
 * en un contexto de Next.js sin el dynamic import.
 * 
 * Lo importo dinamicamente una sola vez
 */

import * as faceapi from "face-api.js"

export default faceapi;