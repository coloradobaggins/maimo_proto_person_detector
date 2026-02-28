module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/lib/face-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
/**
 * Modulo singleton.
 * Face-api.js usa APIs del browser y no se puede importar estaticamente como los demas modulos en el inicio de los archivos.
 * en un contexto de Next.js sin el dynamic import.
 * 
 * Lo importo dinamicamente una sola vez
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$face$2d$api$2e$js$2f$build$2f$es6$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/face-api.js/build/es6/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$face$2d$api$2e$js$2f$build$2f$es6$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/face-api.js/build/es6/index.js [app-ssr] (ecmascript)");
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$face$2d$api$2e$js$2f$build$2f$es6$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__;
}),
"[project]/hooks/useFaceApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFaceApi",
    ()=>useFaceApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$face$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/face-api.ts [app-ssr] (ecmascript)");
"use client";
;
;
function useFaceApi() {
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        async function loadModels() {
            try {
                await Promise.all([
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$face$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].nets.tinyFaceDetector.loadFromUri("/models"),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$face$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].nets.ageGenderNet.loadFromUri("/models")
                ]);
                if (!cancelled) setIsLoaded(true);
            } catch (err) {
                if (!cancelled) setError(err);
            }
        }
        loadModels();
        return ()=>{
            cancelled = true;
        };
    }, []);
    return {
        isLoaded,
        error
    };
}
}),
"[project]/hooks/useWebcam.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWebcam",
    ()=>useWebcam
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function useWebcam() {
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isReady, setIsReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let stream = null;
        async function startWebcam() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
                //stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    //videoRef.current.onloadmetadata = () => setIsReady(true); // * onloadmetadata no es confiable cuando viene de la webcam
                    //videoRef.current.addEventListener("loadeddata", () => setIsReady(true));
                    videoRef.current.addEventListener("canplay", ()=>setIsReady(true));
                }
            } catch (err) {
                setError(err);
            }
        }
        startWebcam();
        return ()=>{
            stream?.getTracks().forEach((track)=>track.stop());
        };
    }, []);
    return {
        videoRef,
        isReady,
        error
    };
}
}),
"[project]/hooks/useFaceDetection.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFaceDetection",
    ()=>useFaceDetection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$face$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/face-api.ts [app-ssr] (ecmascript)");
"use client";
;
;
// ─── Constantes ──────────────────────────────────────────────────────────────
const DETECTION_INTERVAL_MS = 200;
const CONSECUTIVE_HITS_REQUIRED = 8;
const COOLDOWN_MS = 10_000;
const VERIFY_MAX_ATTEMPTS = 6;
// ─── Helper puro (sin dependencias del hook) ─────────────────────────────────
function classifyDetections(detections) {
    if (detections.length === 0) return "idle";
    const ages = detections.map((d)=>Math.round(d.age));
    const hasAdult = ages.some((age)=>age > 16);
    const hasChild = ages.some((age)=>age >= 2 && age <= 15);
    if (hasAdult && hasChild) return "both";
    if (hasAdult) return "adult";
    if (hasChild) return "child";
    return "idle";
}
function useFaceDetection(videoRef, isReady, isLoaded) {
    const [detectionState, setDetectionState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const phase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("searching");
    const consecutiveHits = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const confirmedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("idle");
    const verifyAttempts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const timeoutId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isReady || !isLoaded) return;
        // ── FASE 1: SEARCHING ────────────────────────────────────────────────────
        async function searching() {
            if (phase.current !== "searching") return;
            const detections = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$face$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].detectAllFaces(videoRef.current, new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$face$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].TinyFaceDetectorOptions({
                inputSize: 416,
                scoreThreshold: 0.3
            })).withAgeAndGender();
            const classified = classifyDetections(detections);
            if (classified !== "idle") {
                if (classified !== confirmedState.current) {
                    consecutiveHits.current = 0;
                    confirmedState.current = classified;
                }
                consecutiveHits.current++;
                console.log(`Searching: ${classified} (${consecutiveHits.current}/${CONSECUTIVE_HITS_REQUIRED})`);
                if (consecutiveHits.current >= CONSECUTIVE_HITS_REQUIRED) {
                    consecutiveHits.current = 0;
                    phase.current = "active";
                    setDetectionState(confirmedState.current);
                    console.log(`✅ Confirmado: ${confirmedState.current} → ACTIVE`);
                    scheduleActive();
                    return;
                }
            } else {
                consecutiveHits.current = 0;
                confirmedState.current = "idle";
            }
            timeoutId.current = setTimeout(searching, DETECTION_INTERVAL_MS);
        }
        // ── FASE 2: ACTIVE (cooldown) ────────────────────────────────────────────
        function scheduleActive() {
            console.log(`ACTIVE - cooldown ${COOLDOWN_MS}ms`);
            timeoutId.current = setTimeout(()=>{
                console.log("Cooldown terminado → VERIFYING");
                phase.current = "verifying";
                verifyAttempts.current = 0;
                verifying();
            }, COOLDOWN_MS);
        }
        // ── FASE 3: VERIFYING ────────────────────────────────────────────────────
        async function verifying() {
            if (phase.current !== "verifying") return;
            const detections = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$face$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].detectAllFaces(videoRef.current, new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$face$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].TinyFaceDetectorOptions({
                inputSize: 416,
                scoreThreshold: 0.3
            })).withAgeAndGender();
            const classified = classifyDetections(detections);
            if (classified !== "idle") {
                console.log(`Sigue presente: ${classified} → ACTIVE`);
                phase.current = "active";
                confirmedState.current = classified;
                setDetectionState(classified);
                scheduleActive();
                return;
            }
            verifyAttempts.current++;
            console.log(`Verifying: intento ${verifyAttempts.current}/${VERIFY_MAX_ATTEMPTS}`);
            if (verifyAttempts.current >= VERIFY_MAX_ATTEMPTS) {
                console.log("Nadie encontrado → IDLE");
                phase.current = "searching";
                confirmedState.current = "idle";
                consecutiveHits.current = 0;
                setDetectionState("idle");
                timeoutId.current = setTimeout(searching, DETECTION_INTERVAL_MS);
                return;
            }
            timeoutId.current = setTimeout(verifying, DETECTION_INTERVAL_MS);
        }
        // Arrancamos en searching
        searching();
        return ()=>{
            if (timeoutId.current) clearTimeout(timeoutId.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isReady,
        isLoaded
    ]);
    return {
        detectionState,
        canvasRef
    };
}
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFaceApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useFaceApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useWebcam$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useWebcam.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFaceDetection$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useFaceDetection.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function Home() {
    const [isDebug, setIsDebug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { isLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFaceApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFaceApi"])();
    const { videoRef, isReady, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useWebcam$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWebcam"])();
    const { detectionState, canvasRef } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFaceDetection$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFaceDetection"])(videoRef, isReady, isLoaded);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                children: "FaceApi js"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Error con la webcam: ",
                    error.message
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 18,
                columnNumber: 17
            }, this),
            !isLoaded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Cargando modelos..."
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 19,
                columnNumber: 21
            }, this),
            isLoaded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Modelos cargados."
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 20,
                columnNumber: 20
            }, this),
            isLoaded && isReady && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Listo para detectar people"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 21,
                columnNumber: 31
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 24,
                    marginTop: 24
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 100,
                            height: 100,
                            borderRadius: 8,
                            backgroundColor: detectionState === "adult" || detectionState === "both" ? "blue" : "white",
                            border: "2px solid #ccc",
                            transition: "background-color 0.3s"
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 25,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 100,
                            height: 100,
                            borderRadius: 8,
                            backgroundColor: detectionState === "child" || detectionState === "both" ? "green" : "white",
                            border: "2px solid #ccc",
                            transition: "background-color 0.3s"
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: [
                    "Estado: ",
                    detectionState
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "relative",
                    width: 640,
                    height: 480,
                    visibility: "hidden"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                    ref: videoRef,
                    autoPlay: true,
                    muted: true,
                    playsInline: true,
                    style: {
                        width: 640,
                        height: 480
                    }
                }, void 0, false, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e065c192._.js.map