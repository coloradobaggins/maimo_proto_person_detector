"use client"

import { useEffect, useRef, useState } from "react";

export function useWebcam() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let stream: MediaStream | null = null;

        async function startWebcam() {
            try {

                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                //stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });

                if(videoRef.current) {
                    videoRef.current.srcObject = stream;
                    //videoRef.current.onloadmetadata = () => setIsReady(true); // * onloadmetadata no es confiable cuando viene de la webcam
                    //videoRef.current.addEventListener("loadeddata", () => setIsReady(true));
                    videoRef.current.addEventListener("canplay", () => setIsReady(true));
                }

            } catch (err) {
                setError(err as Error);
            }
        }

        startWebcam();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        }

    }, []);

    return { videoRef, isReady, error}
}